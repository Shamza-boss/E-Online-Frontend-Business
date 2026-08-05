import type { SxProps, Theme } from '@mui/material/styles';

export type PdfSizeChipStyle = {
  label: string;
  sx: SxProps<Theme>;
}

export type LibrarySizeChipProps = {
  sizeBytes?: number | null;
}

export type LibraryVisibilityChipProps = {
  isPublic: boolean;
}
