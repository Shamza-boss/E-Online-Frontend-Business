/**
 * Server-side API Fetch Utility
 *
 * Provides a unified interface for making API calls from both server
 * and client components. Handles authentication, error handling, and
 * redirects automatically.
 *
 * @example
 * // Server component
 * const users = await serverFetch<User[]>('/users');
 *
 * // With options
 * const user = await serverFetch<User>('/users', {
 *   method: 'POST',
 *   body: { name: 'John' },
 * });
 */

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import {
  type HttpMethod,
  BODYLESS_METHODS,
  DEFAULT_TIMEOUT,
  CONTENT_TYPES,
} from '@/lib/api';

// Fetch options with Next.js specific config
interface FetchOptions extends RequestInit {
  next?: { revalidate?: number; tags?: string[] };
}

interface ApiFetchOptions {
  /** HTTP method (default: 'GET') */
  method?: HttpMethod;
  /** Request body - automatically serialized for JSON */
  body?: unknown;
  /** Additional headers */
  headers?: Record<string, string>;
  /** Request timeout in ms (default: 15000) */
  timeout?: number;
  /** Cache tags for revalidation */
  tags?: string[];
}

/**
 * Normalize endpoint path
 */
function normalizeEndpoint(endpoint: string): string {
  return endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
}

/**
 * Build request headers
 */
function buildHeaders(
  customHeaders: Record<string, string>,
  authToken?: string
): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': CONTENT_TYPES.json,
    ...customHeaders,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
}

/**
 * Prepare request body
 */
function prepareBody(
  body: unknown,
  method: HttpMethod,
  headers: Record<string, string>
): string | FormData | undefined {
  if (!body || BODYLESS_METHODS.includes(method as 'GET' | 'HEAD')) {
    return undefined;
  }

  // Handle FormData - let browser set Content-Type
  if (body instanceof FormData) {
    delete headers['Content-Type'];
    return body;
  }

  // Serialize to JSON
  return typeof body === 'string' ? body : JSON.stringify(body);
}

/**
 * Generate error reference ID for tracking
 */
function generateErrorRef(): string {
  return crypto.randomUUID().slice(0, 8);
}

/**
 * Unified fetch function for API calls
 *
 * Works in both server and client contexts:
 * - Server: Calls backend directly with auth token
 * - Client: Routes through /api/proxy for auth handling
 */
export async function serverFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers: customHeaders = {},
    timeout = DEFAULT_TIMEOUT,
    tags,
  } = options;

  const normalized = normalizeEndpoint(endpoint);
  const isServer = typeof window === 'undefined';

  // Determine fetch URL and auth
  let fetchUrl: string;
  let authToken: string | undefined;

  if (isServer) {
    const session = await auth();
    if (!session) redirect('/signin');

    authToken = session.apiAccessToken;
    fetchUrl = `${process.env.BASE_API_URL}/api/${normalized}`;
  } else {
    fetchUrl = `/api/proxy/${normalized}`;
  }

  // Build headers
  const headers = buildHeaders(customHeaders, authToken);

  // Build fetch options
  const fetchOpts: FetchOptions = {
    method,
    credentials: 'include',
    headers,
    cache: 'no-store',
    next: { revalidate: 0, ...(tags && { tags }) },
    body: prepareBody(body, method, headers),
  };

  // Setup timeout
  const controller = new AbortController();
  fetchOpts.signal = controller.signal;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(fetchUrl, fetchOpts);

    // Handle 401 - redirect to sign in
    if (response.status === 401) {
      console.error('[Auth] Session expired or invalid');
      redirect('/signin');
    }

    // Handle other errors
    if (!response.ok) {
      const text = await response.text();
      const ref = generateErrorRef();
      console.error(`[API Error – ${ref}]`, {
        status: response.status,
        url: fetchUrl,
        body: text.slice(0, 200),
      });
      redirect(`/error/server-error?ref=${ref}`);
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) return null as T;

    return JSON.parse(text) as T;
  } catch (error) {
    // Handle abort (timeout)
    if (error instanceof DOMException && error.name === 'AbortError') {
      const ref = generateErrorRef();
      console.error(`[API Timeout – ${ref}]`, { url: fetchUrl });
      redirect(`/error/server-error?ref=${ref}`);
    }

    // Re-throw redirect errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    // Log and redirect for other errors
    const ref = generateErrorRef();
    console.error(`[API Error – ${ref}]`, { error, url: fetchUrl });
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
