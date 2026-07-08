import { alpha } from '@mui/material/styles';

export const BIG_PDF_THRESHOLD_BYTES = 5 * 1024 * 1024;

export const libraryVisibilityChipSx = {
  public: {
    bgcolor: alpha('#10B981', 0.1),
    color: '#10B981',
    '& .MuiChip-icon': { color: 'inherit' },
  },
  private: {
    bgcolor: alpha('#6B7280', 0.1),
    color: '#6B7280',
    '& .MuiChip-icon': { color: 'inherit' },
  },
} as const;
