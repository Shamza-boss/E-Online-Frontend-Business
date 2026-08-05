export const DEFAULT_PAGE_SIZE = 20;

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export const DELETE_ANIMATION_MS = 300;

export const DATA_GRID_SLOT_PROPS = {
  loadingOverlay: {
    variant: 'skeleton' as const,
    noRowsVariant: 'skeleton' as const,
  },
};
