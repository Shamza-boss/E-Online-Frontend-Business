/**
 * SWR Configuration
 *
 * Optimized SWR settings and typed fetcher utilities for
 * consistent data fetching patterns across the app.
 */

import type { SWRConfiguration, Fetcher } from 'swr';

/**
 * Default SWR configuration
 *
 * Optimized for performance and user experience:
 * - Reduces unnecessary re-fetches
 * - Maintains smooth UI with previous data
 * - Handles errors gracefully with retries
 */
export const swrConfig: SWRConfiguration = {
  // Revalidation settings
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  revalidateIfStale: true,
  refreshInterval: 0,

  // Deduplication and caching
  dedupingInterval: 2000,
  keepPreviousData: true,

  // Error handling
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  shouldRetryOnError: (error) => {
    // Don't retry on 4xx errors (client errors)
    if (error?.status >= 400 && error?.status < 500) {
      return false;
    }
    return true;
  },

  // Performance
  focusThrottleInterval: 5000,
  loadingTimeout: 3000,

  // Comparison function - uses shallow comparison by default
  // Override per-hook if deep comparison is needed
  compare: (a, b) => JSON.stringify(a) === JSON.stringify(b),
};

/**
 * Create a typed fetcher for SWR
 *
 * @example
 * const { data } = useSWR('/api/users', createFetcher<User[]>());
 */
export function createFetcher<T>(): Fetcher<T, string> {
  return async (url: string): Promise<T> => {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the data.');
      (error as any).status = response.status;
      (error as any).info = await response.text();
      throw error;
    }

    return response.json();
  };
}

/**
 * Create a fetcher with custom options
 */
export function createCustomFetcher<T>(
  options?: RequestInit
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
      const error = new Error('An error occurred while fetching the data.');
      (error as any).status = response.status;
      (error as any).info = await response.text();
      throw error;
    }

    return response.json();
  };
}

/**
 * Proxy endpoint fetcher
 *
 * Fetcher that routes through /api/proxy for authenticated requests
 *
 * @example
 * const { data } = useSWR('/classrooms', proxyFetcher<Classroom[]>);
 */
export const proxyFetcher = async <T>(endpoint: string): Promise<T> => {
  const normalized = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `/api/proxy/${normalized}`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = new Error('API request failed');
    (error as any).status = response.status;
    throw error;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

/**
 * Create a proxy fetcher with query params
 */
export function createProxyFetcher<T>(
  baseEndpoint: string
): Fetcher<T, Record<string, unknown> | undefined> {
  return async (params?: Record<string, unknown>): Promise<T> => {
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
      const error = new Error('API request failed');
      (error as any).status = response.status;
      throw error;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  };
}

// Type for SWR hooks with loading/error states
export interface SWRState<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
}
