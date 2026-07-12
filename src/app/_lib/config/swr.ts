/**
 * SWR Configuration
 *
 * Global SWR defaults. Proxy-based fetchers live in `_lib/services/clientFetch.ts`.
 */

import type { SWRConfiguration } from 'swr';

type FetchHttpError = Error & {
  status: number;
  info?: string;
};

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

export type SWRState<T> = {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
};
