'use client';

import React from 'react';
import { debounce } from 'es-toolkit';

type SearchScopeId = string;

type RegisterSearchConfig = {
  id: SearchScopeId;
  placeholder: string;
  onSearch: (term: string) => void;
  debounceMs?: number;
};

type SearchState = {
  scope: SearchScopeId | null;
  placeholder: string;
  searchTerm: string;
  enabled: boolean;
  debounceMs: number;
  onSearch?: (term: string) => void;
};

const DEFAULT_DEBOUNCE_MS = 300;

const makeDefaultState = (): SearchState => ({
  scope: null,
  placeholder: 'Search...',
  searchTerm: '',
  enabled: false,
  debounceMs: DEFAULT_DEBOUNCE_MS,
  onSearch: undefined,
});

type SearchContextValue = {
  state: SearchState;
  registerSearch: (config: RegisterSearchConfig) => () => void;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
};

const SearchContext = React.createContext<SearchContextValue | undefined>(
  undefined
);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<SearchState>(makeDefaultState);
  const activeScopeRef = React.useRef<SearchScopeId | null>(null);
  type DebouncedSearchFn = ((term: string) => void) & {
    cancel: () => void;
    run?: (term: string) => void;
  };
  const debouncedSearchRef = React.useRef<DebouncedSearchFn | null>(null);

  const cancelDebounce = React.useCallback(() => {
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current.run = undefined;
      debouncedSearchRef.current.cancel();
      debouncedSearchRef.current = null;
    }
  }, []);

  const registerSearch = React.useCallback(
    (config: RegisterSearchConfig) => {
      const debounceMs = config.debounceMs ?? DEFAULT_DEBOUNCE_MS;
      cancelDebounce();
      activeScopeRef.current = config.id;

      let nextSearchTerm = '';
      let shouldTrigger = false;

      setState((prev) => {
        const isSameScope = prev.scope === config.id;
        nextSearchTerm = isSameScope ? prev.searchTerm : '';
        shouldTrigger =
          !isSameScope ||
          prev.onSearch !== config.onSearch ||
          prev.debounceMs !== debounceMs;
        return {
          scope: config.id,
          placeholder: config.placeholder,
          searchTerm: nextSearchTerm,
          enabled: true,
          debounceMs,
          onSearch: config.onSearch,
        };
      });

      const debounced = debounce((term: string) => {
        debouncedSearchRef.current?.run?.(term);
      }, debounceMs) as DebouncedSearchFn;

      debounced.run = config.onSearch;

      debouncedSearchRef.current = debounced;

      if (shouldTrigger && typeof config.onSearch === 'function') {
        config.onSearch(nextSearchTerm);
      }

      return () => {
        if (activeScopeRef.current === config.id) {
          activeScopeRef.current = null;
          cancelDebounce();
          setState((prev) =>
            prev.scope === config.id ? makeDefaultState() : prev
          );
        }
      };
    },
    [cancelDebounce]
  );

  const setSearchTerm = React.useCallback((term: string) => {
    let shouldSchedule = false;
    setState((prev) => {
      if (prev.searchTerm === term) {
        return prev;
      }
      shouldSchedule = prev.enabled;
      return { ...prev, searchTerm: term };
    });

    if (shouldSchedule && debouncedSearchRef.current) {
      debouncedSearchRef.current(term);
    }
  }, []);

  const clearSearch = React.useCallback(() => {
    let shouldSchedule = false;
    setState((prev) => {
      if (!prev.enabled || prev.searchTerm === '') {
        return prev;
      }
      shouldSchedule = true;
      return { ...prev, searchTerm: '' };
    });

    if (shouldSchedule && debouncedSearchRef.current) {
      debouncedSearchRef.current('');
    }
  }, []);

  React.useEffect(() => {
    return () => {
      cancelDebounce();
    };
  }, [cancelDebounce]);

  const value = React.useMemo(
    () => ({
      state,
      registerSearch,
      setSearchTerm,
      clearSearch,
    }),
    [state, registerSearch, setSearchTerm, clearSearch]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}

type UseRegisterSearchOptions = RegisterSearchConfig & {
  active?: boolean;
};

export function useRegisterSearch({
  id,
  placeholder,
  onSearch,
  debounceMs,
  active = true,
}: UseRegisterSearchOptions) {
  const { registerSearch, state, setSearchTerm } = useSearchContext();

  React.useEffect(() => {
    if (!active) {
      return undefined;
    }
    const cleanup = registerSearch({ id, placeholder, onSearch, debounceMs });
    return cleanup;
  }, [active, id, placeholder, onSearch, debounceMs, registerSearch]);

  const isCurrentScope = state.scope === id;

  const boundSetSearchTerm = React.useCallback(
    (value: string) => {
      if (!active || !isCurrentScope) {
        return;
      }
      setSearchTerm(value);
    },
    [active, isCurrentScope, setSearchTerm]
  );

  return {
    searchTerm: isCurrentScope ? state.searchTerm : '',
    setSearchTerm: boundSetSearchTerm,
    enabled: active && isCurrentScope && state.enabled,
  } as const;
}
