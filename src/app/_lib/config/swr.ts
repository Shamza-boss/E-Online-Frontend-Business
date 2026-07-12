/**
 * SWR Configuration
 *
 * Optimized SWR settings and typed fetcher utilities for
 * consistent data fetching patterns across the app.
 */

import type { SWRConfiguration, Fetcher } from 'swr';

type FetchHttpError = Error & {
  status: number;
  info?: string;
};

type ProxyQueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

function createFetchError(response: Response, info?: string): FetchHttpError {
  const error = new Error(
    'An error occurred while fetching the data.',
  ) as FetchHttpError;
  error.status = response.status;
  error.info = info;
  return error;
}

/**
 * Default SWR configuration
 */
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  revalidateIfStale: true,
  refreshInterval: 0,
  dedupingInterval: 2000,
  keepPreviousData: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  shouldRetryOnError: (error) => {
    const status = (error as FetchHttpError).status;
    if (status >= 400 && status < 500) {
      return false;
    }
    return true;
  },
  focusThrottleInterval: 5000,
  loadingTimeout: 3000,
  compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
};

export function createFetcher<T>(): Fetcher<T, string> {
  return async (url: string): Promise<T> => {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw createFetchError(response, await response.text());
    }

    return response.json() as Promise<T>;
  };
}

export function createCustomFetcher<T>(
  options?: RequestInit,
): Fetcher<T, string> {
  return async (url: string): Promise<T> => {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw createFetchError(response, await response.text());
    }

    return response.json() as Promise<T>;
  };
}

export const proxyFetcher = async <T>(endpoint: string): Promise<T | null> => {
  const normalized = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `/api/proxy/${normalized}`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw createFetchError(response);
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : null;
};

export function createProxyFetcher<T>(
  baseEndpoint: string,
): Fetcher<T | null, ProxyQueryParams | undefined> {
  return async (params?: ProxyQueryParams): Promise<T | null> => {
    const normalized = baseEndpoint.startsWith('/')
      ? baseEndpoint.slice(1)
      : baseEndpoint;

    let url = `/api/proxy/${normalized}`;

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      }
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw createFetchError(response);
    }

    const text = await response.text();
    return text ? (JSON.parse(text) as T) : null;
  };
}

export type SWRState<T> = {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
};
