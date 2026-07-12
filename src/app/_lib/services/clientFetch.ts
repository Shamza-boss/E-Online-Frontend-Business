/**
 * Client-side API Fetch Utility
 *
 * Safe wrapper for client components using SWR or other client-side data fetching.
 * Uses the proxy endpoint to avoid redirect() issues in client components.
 */

import { type HttpMethod, BODYLESS_METHODS, CONTENT_TYPES } from '@/lib/api';
import type { JsonValue } from '@/lib/api/json';

type ClientFetchBody = JsonValue | FormData | string;

type ClientFetchOptions = {
  /** HTTP method (default: 'GET') */
  method?: HttpMethod;
  /** Request body - automatically serialized for JSON */
  body?: ClientFetchBody;
  /** Additional headers */
  headers?: Record<string, string>;
};

/**
 * Client-safe fetch for use in client components
 * Routes through /api/proxy to avoid server-side redirect issues
 */
export async function clientFetch<T>(
  endpoint: string,
  options: ClientFetchOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers: customHeaders = {} } = options;

  const normalized = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `/api/proxy/${normalized}`;

  const headers: Record<string, string> = {
    'Content-Type': CONTENT_TYPES.json,
    ...customHeaders,
  };

  let requestBody: string | FormData | undefined;
  if (body && !BODYLESS_METHODS.includes(method as 'GET' | 'HEAD')) {
    if (body instanceof FormData) {
      delete headers['Content-Type'];
      requestBody = body;
    } else {
      requestBody = typeof body === 'string' ? body : JSON.stringify(body);
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    body: requestBody,
    credentials: 'include',
  });

  if (response.status === 401) {
    window.location.href = '/signin';
    throw new Error('Unauthorized - redirecting to sign in');
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error: ${response.status} - ${text.slice(0, 200)}`);
  }

  const text = await response.text();
  if (!text) return null as T;

  return JSON.parse(text) as T;
}

export const swrFetcher = <T>(endpoint: string): Promise<T> =>
  clientFetch<T>(endpoint);
