'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Custom hook to track navigation loading state
 * Useful for components that need to show loading UI during navigation
 *
 * @returns {boolean} isNavigating - true when navigation is in progress
 *
 * @example
 * ```tsx
 * const isNavigating = useNavigationLoading();
 *
 * if (isNavigating) {
 *   return <Skeleton />;
 * }
 * ```
 */
export function useNavigationLoading() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    // Check if pathname has changed
    if (pathname !== prevPathname) {
      setIsNavigating(true);
      setPrevPathname(pathname);

      // Reset after a short delay to account for rendering
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [pathname, prevPathname]);

  return isNavigating;
}

/**
 * Custom hook to add a minimum loading time
 * Prevents loading flashes for fast operations
 *
 * @param isLoading - the actual loading state
 * @param minDuration - minimum duration in ms (default: 300ms)
 * @returns {boolean} - loading state with minimum duration enforced
 *
 * @example
 * ```tsx
 * const [fetching, setFetching] = useState(true);
 * const isLoading = useMinimumLoading(fetching, 500);
 * ```
 */
export function useMinimumLoading(
  isLoading: boolean,
  minDuration: number = 300
) {
  const [showLoading, setShowLoading] = useState(isLoading);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
      setLoadingStartTime(Date.now());
    } else if (loadingStartTime !== null) {
      const elapsed = Date.now() - loadingStartTime;
      const remaining = Math.max(0, minDuration - elapsed);

      const timer = setTimeout(() => {
        setShowLoading(false);
        setLoadingStartTime(null);
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [isLoading, loadingStartTime, minDuration]);

  return showLoading;
}
