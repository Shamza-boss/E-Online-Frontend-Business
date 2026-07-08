import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
import { formatTextbookFileSize } from '@/app/_lib/utils/textbook';
import { BIG_PDF_THRESHOLD_BYTES } from './constants';
import type { PdfSizeChipStyle } from './interfaces';

export function formatLibraryDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy');
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
