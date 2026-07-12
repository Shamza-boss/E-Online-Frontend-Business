/**
 * Client-side API fetch via authenticated proxy.
 * Server components and actions should use serverFetch.server.ts instead.
 */

import {
  type HttpMethod,
  BODYLESS_METHODS,
  DEFAULT_TIMEOUT,
  CONTENT_TYPES,
} from '@/lib/api';

type FetchOptions = {
  next?: { revalidate?: number; tags?: string[] };
} & RequestInit

export type ApiFetchOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  tags?: string[];
}

function normalizeEndpoint(endpoint: string): string {
  return endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
}

function buildHeaders(customHeaders: Record<string, string>): Record<string, string> {
  return {
    'Content-Type': CONTENT_TYPES.json,
    ...customHeaders,
  };
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
  } = options;

  const normalized = normalizeEndpoint(endpoint);
  const fetchUrl = `/api/proxy/${normalized}`;
  const headers = buildHeaders(customHeaders);

  const fetchOpts: FetchOptions = {
    method,
    credentials: 'include',
    headers,
    cache: 'no-store',
    body: prepareBody(body, method, headers),
  };

  const controller = new AbortController();
  fetchOpts.signal = controller.signal;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(fetchUrl, fetchOpts);

    if (response.status === 401) {
      throw new Error('Unauthorized');
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

    const ref = generateErrorRef();
    console.error(`[API Error – ${ref}]`, { error, url: fetchUrl });
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
