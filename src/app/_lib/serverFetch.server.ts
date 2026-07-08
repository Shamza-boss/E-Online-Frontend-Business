import 'server-only';

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import {
  type HttpMethod,
  BODYLESS_METHODS,
  DEFAULT_TIMEOUT,
  CONTENT_TYPES,
} from '@/lib/api';

interface FetchOptions extends RequestInit {
  next?: { revalidate?: number; tags?: string[] };
}

export interface ApiFetchOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  tags?: string[];
  revalidate?: number;
}

function normalizeEndpoint(endpoint: string): string {
  return endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
}

function buildHeaders(
  customHeaders: Record<string, string>,
  authToken?: string,
): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': CONTENT_TYPES.json,
    ...customHeaders,
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  return headers;
}

function prepareBody(
  body: unknown,
  method: HttpMethod,
  headers: Record<string, string>,
): string | FormData | undefined {
  if (!body || BODYLESS_METHODS.includes(method as 'GET' | 'HEAD')) {
    return undefined;
  }

  if (body instanceof FormData) {
    delete headers['Content-Type'];
    return body;
  }

  return typeof body === 'string' ? body : JSON.stringify(body);
}

function generateErrorRef(): string {
  return crypto.randomUUID().slice(0, 8);
}

export async function serverFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers: customHeaders = {},
    timeout = DEFAULT_TIMEOUT,
    tags,
    revalidate,
  } = options;

  const session = await auth();
  if (!session) {
    redirect('/signin');
  }

  const normalized = normalizeEndpoint(endpoint);
  const fetchUrl = `${process.env.BASE_API_URL}/api/${normalized}`;
  const headers = buildHeaders(customHeaders, session.apiAccessToken);

  const fetchOpts: FetchOptions = {
    method,
    credentials: 'include',
    headers,
    cache: revalidate != null ? 'default' : 'no-store',
    next: {
      ...(revalidate != null ? { revalidate } : { revalidate: 0 }),
      ...(tags && { tags }),
    },
    body: prepareBody(body, method, headers),
  };

  const controller = new AbortController();
  fetchOpts.signal = controller.signal;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(fetchUrl, fetchOpts);

    if (response.status === 401) {
      console.error('[Auth] Session expired or invalid');
      redirect('/signin');
    }

    if (!response.ok) {
      const text = await response.text();
      const ref = generateErrorRef();
      console.error(`[API Error – ${ref}]`, {
        status: response.status,
        url: fetchUrl,
        body: text.slice(0, 200),
      });
      const error = new Error(`API Error ${response.status}: ${text.slice(0, 100)}`);
      error.name = 'ApiError';
      throw error;
    }

    const text = await response.text();
    if (!text) {
      return null as T;
    }

    return JSON.parse(text) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      const ref = generateErrorRef();
      console.error(`[API Timeout – ${ref}]`, { url: fetchUrl });
      const timeoutError = new Error(`Request timeout: ${fetchUrl}`);
      timeoutError.name = 'TimeoutError';
      throw timeoutError;
    }

    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    const ref = generateErrorRef();
    console.error(`[API Error – ${ref}]`, { error, url: fetchUrl });
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
