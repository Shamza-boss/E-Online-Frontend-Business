import type { SxProps, Theme } from '@mui/material/styles';

export interface PdfSizeChipStyle {
  label: string;
  sx: SxProps<Theme>;
}

export interface LibrarySizeChipProps {
  sizeBytes?: number | null;
}

export interface LibraryVisibilityChipProps {
  isPublic: boolean;
}
