import { useEffect, useState } from 'react';
import type { LibraryViewMode } from '../LibraryToolbar';
import { VIEW_MODE_KEY } from './constants';

export function extractName(fileKey: string): string {
  return fileKey.split('_').pop() ?? fileKey;
}

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export function readStoredViewMode(): LibraryViewMode {
  if (typeof window === 'undefined') return 'cards';
  const stored = window.localStorage.getItem(VIEW_MODE_KEY);
  return stored === 'table' ? 'table' : 'cards';
}
