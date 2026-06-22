import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import { format } from 'date-fns';
import { formatTextbookFileSize } from '@/app/_lib/utils/textbook';

export const BIG_PDF_THRESHOLD_BYTES = 5 * 1024 * 1024;

export function formatLibraryDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy');
}

export interface PdfSizeChipStyle {
  label: string;
  sx: SxProps<Theme>;
}

export function getPdfSizeChipStyle(
  sizeBytes?: number | null
): PdfSizeChipStyle {
  if (sizeBytes == null || sizeBytes <= 0) {
    return {
      label: 'Size unknown',
      sx: {
        bgcolor: alpha('#6B7280', 0.1),
        color: '#6B7280',
        '& .MuiChip-icon': { color: 'inherit' },
      },
    };
  }

  const label = formatTextbookFileSize(sizeBytes);
  const isBig = sizeBytes > BIG_PDF_THRESHOLD_BYTES;

  if (isBig) {
    return {
      label,
      sx: {
        bgcolor: alpha('#F59E0B', 0.14),
        color: '#B45309',
        fontWeight: 600,
        '& .MuiChip-icon': { color: 'inherit' },
      },
    };
  }

  return {
    label,
    sx: {
      bgcolor: alpha('#3B82F6', 0.1),
      color: '#2563EB',
      '& .MuiChip-icon': { color: 'inherit' },
    },
  };
}

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
