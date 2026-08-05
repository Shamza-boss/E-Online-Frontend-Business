/**
 * Client-side API fetch via authenticated `/api/proxy`.
 *
 * Single entry point for browser → BFF calls. Prefer Server Actions for new code;
 * use this only for SWR keys that hit the proxy directly.
 */

import { type HttpMethod, BODYLESS_METHODS, CONTENT_TYPES } from '@/lib/api';
import type { JsonValue } from '@/lib/api/json';
import type { Fetcher } from 'swr';

type ClientFetchBody = JsonValue | FormData | string;

export type ClientFetchOptions = {
  method?: HttpMethod;
  body?: ClientFetchBody;
  headers?: Record<string, string>;
};

type ProxyQueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

type FetchHttpError = Error & {
  status: number;
  info?: string;
};

function createFetchError(response: Response, info?: string): FetchHttpError {
  const error = new Error(
    'An error occurred while fetching the data.',
  ) as FetchHttpError;
  error.status = response.status;
  error.info = info;
  return error;
}

function normalizeEndpoint(endpoint: string): string {
  return endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
}

/**
 * Client-safe fetch for use in client components.
 * Routes through `/api/proxy` to keep auth cookies and avoid server-only redirects.
 */
export async function clientFetch<T>(
  endpoint: string,
  options: ClientFetchOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers: customHeaders = {} } = options;

  const url = `/api/proxy/${normalizeEndpoint(endpoint)}`;

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
    throw createFetchError(response, text.slice(0, 200));
  }

  const text = await response.text();
  if (!text) return null as T;

  return JSON.parse(text) as T;
}

/** SWR-compatible GET fetcher (alias of `clientFetch`). */
export const swrFetcher = <T>(endpoint: string): Promise<T> =>
  clientFetch<T>(endpoint);

/** @deprecated Prefer `clientFetch` / `swrFetcher`. */
export const proxyFetcher = swrFetcher;

export function createProxyFetcher<T>(
  baseEndpoint: string,
): Fetcher<T | null, ProxyQueryParams | undefined> {
  return async (params?: ProxyQueryParams): Promise<T | null> => {
    let endpoint = normalizeEndpoint(baseEndpoint);

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      }
      endpoint += `?${searchParams.toString()}`;
    }

    return clientFetch<T | null>(endpoint);
  };
}
