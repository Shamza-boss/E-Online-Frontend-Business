export const DEFAULT_PAGE_SIZE = 20;

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export const SEARCH_CONTEXT_ID = 'dashboard-institutions';
export const SEARCH_PLACEHOLDER = 'Search institutions';
export const SEARCH_DEBOUNCE_MS = 300;

export const DATA_GRID_SLOT_PROPS = {
  loadingOverlay: {
    variant: 'linear-progress' as const,
    noRowsVariant: 'linear-progress' as const,
  },
};
