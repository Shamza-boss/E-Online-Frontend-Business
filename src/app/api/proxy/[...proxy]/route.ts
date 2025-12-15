/**
 * API Proxy Route Handler
 *
 * Proxies requests to the backend API with authentication.
 * Handles both JSON and multipart/form-data (file uploads).
 *
 * @route /api/proxy/[...proxy]
 */

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  PROXY_STRIP_HEADERS,
  MULTIPART_CONTENT_TYPE,
  BODYLESS_METHODS,
} from '@/lib/api';
import type { HomeworkPayload } from '@/app/_lib/interfaces/types';
import { validateHomeworkPayload } from '@/lib/validation/homeworkQuestions';

// Route segment config - always dynamic, never cached
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const BACKEND_URL = process.env.BASE_API_URL;

// Types
type ProxyContext = { params: Promise<{ proxy: string[] }> };

/**
 * Build the target URL for the backend API
 */
function buildTargetUrl(path: string[], searchParams: string): string {
  const endpoint = path.join('/');
  const base = `${BACKEND_URL}/api/${endpoint}`;
  return searchParams ? `${base}${searchParams}` : base;
}

/**
 * Prepare headers for the proxied request
 */
function prepareHeaders(originalHeaders: Headers, authToken?: string): Headers {
  const headers = new Headers(originalHeaders);

  // Remove headers that shouldn't be forwarded
  for (const header of PROXY_STRIP_HEADERS) {
    headers.delete(header);
  }

  // Set or remove authorization
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  } else {
    headers.delete('authorization');
  }

  return headers;
}

/**
 * Check if the request is a multipart/form-data request
 */
function isMultipartRequest(contentType: string | null): boolean {
  return contentType?.includes(MULTIPART_CONTENT_TYPE) ?? false;
}

/**
 * Prepare the request body based on content type
 */
async function prepareBody(
  req: NextRequest,
  headers: Headers
): Promise<ArrayBuffer | string | undefined> {
  const contentType = req.headers.get('content-type');

  // Handle file uploads - pass through as-is
  if (isMultipartRequest(contentType)) {
    // Preserve the original content-type (includes boundary)
    if (contentType) {
      headers.set('content-type', contentType);
    }
    return req.arrayBuffer();
  }

  // Handle JSON and other text-based content
  const raw = await req.text();

  if (!raw) return undefined;

  // Forward JSON payloads exactly as received to align with backend DTO expectations
  return raw;
}

/**
 * Main proxy handler
 */
async function proxyRequest(
  req: NextRequest,
  pathSegments: string[]
): Promise<NextResponse> {
  // Validate backend URL is configured
  if (!BACKEND_URL) {
    console.error('[Proxy] BASE_API_URL is not configured');
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  // Authenticate the request
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Build target URL
  const url = buildTargetUrl(pathSegments, req.nextUrl.search);

  // Prepare headers
  const headers = prepareHeaders(req.headers, session.apiAccessToken);

  // Build fetch options
  const init: RequestInit = {
    method: req.method,
    headers,
  };

  // Add body for non-GET/HEAD requests
  const method = req.method;
  if (!BODYLESS_METHODS.includes(method as (typeof BODYLESS_METHODS)[number])) {
    init.body = await prepareBody(req, headers);

    // Validate homework payloads
    if (
      pathSegments[0] === 'homework' &&
      (method === 'POST' || method === 'PUT') &&
      typeof init.body === 'string'
    ) {
      try {
        const payload = JSON.parse(init.body) as HomeworkPayload;
        // Only validate if it looks like a homework payload (has questions)
        if (payload.questions) {
          const validationError = validateHomeworkPayload(payload);
          if (validationError) {
            return NextResponse.json(
              { error: validationError },
              { status: 400 }
            );
          }
        }
      } catch (e) {
        // Ignore parse errors, let backend handle
      }
    }
  }

  try {
    const response = await fetch(url, init);

    // Some HTTP codes (204/205/304) are defined to have no body.
    const status = response.status;
    const isBodylessStatus = status === 204 || status === 205 || status === 304;

    const proxyResponse = isBodylessStatus
      ? new NextResponse(null, { status })
      : new NextResponse(await response.arrayBuffer(), { status });

    // Copy response headers
    response.headers.forEach((value, key) => {
      proxyResponse.headers.set(key, value);
    });

    return proxyResponse;
  } catch (error) {
    console.error('[Proxy] Request failed:', error);
    return NextResponse.json(
      { error: 'Backend request failed' },
      { status: 502 }
    );
  }
}

/**
 * Extract params and delegate to proxy handler
 */
async function handleRequest(
  req: NextRequest,
  context: ProxyContext
): Promise<NextResponse> {
  const { proxy } = await context.params;
  return proxyRequest(req, proxy);
}

// HTTP method handlers
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
