'use client';

import { Chip } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import {
  getPdfSizeChipStyle,
  libraryVisibilityChipSx,
} from './libraryChipStyles';

interface LibrarySizeChipProps {
  sizeBytes?: number | null;
}

export function LibrarySizeChip({ sizeBytes }: LibrarySizeChipProps) {
  const { label, sx } = getPdfSizeChipStyle(sizeBytes);
  return <Chip size="small" label={label} sx={sx} />;
}

interface LibraryVisibilityChipProps {
  isPublic: boolean;
}

export function LibraryVisibilityChip({ isPublic }: LibraryVisibilityChipProps) {
  return (
    <Chip
      size="small"
      icon={isPublic ? <PublicIcon /> : <LockIcon />}
      label={isPublic ? 'Public' : 'Private'}
      sx={isPublic ? libraryVisibilityChipSx.public : libraryVisibilityChipSx.private}
    />
  );
}
