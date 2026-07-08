'use client';

import { Chip } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import { getPdfSizeChipStyle } from './utils';
import { libraryVisibilityChipSx } from './constants';
import type { LibrarySizeChipProps, LibraryVisibilityChipProps } from './interfaces';

export function LibrarySizeChip({ sizeBytes }: LibrarySizeChipProps) {
  const { label, sx } = getPdfSizeChipStyle(sizeBytes);
  return <Chip size="small" label={label} sx={sx} />;
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
