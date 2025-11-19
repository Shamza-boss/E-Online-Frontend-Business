// Optimized SWR configuration for better performance
import type { SWRConfiguration } from 'swr';

export const swrConfig: SWRConfiguration = {
  // Reduce re-validation frequency for better performance
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  dedupingInterval: 2000,

  // Error retry configuration
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  shouldRetryOnError: true,

  // Keep previous data while revalidating for smoother UX
  keepPreviousData: true,

  // Performance optimizations
  compare: (a, b) => {
    // Deep equality check to prevent unnecessary re-renders
    return JSON.stringify(a) === JSON.stringify(b);
  },

  // Suspense mode for better loading states
  suspense: false, // Enable per-component as needed

  // Loading timeout
  loadingTimeout: 3000,

  // Focus throttle to prevent excessive revalidation
  focusThrottleInterval: 5000,
};

// Hook for optimized SWR usage
export function useOptimizedSWR<Data = any, Error = any>(
  key: any,
  fetcher: (...args: any[]) => Promise<Data>,
  config?: SWRConfiguration<Data, Error>
) {
  const mergedConfig: SWRConfiguration<Data, Error> = {
    ...swrConfig,
    ...config,
  };

  return { config: mergedConfig };
}
