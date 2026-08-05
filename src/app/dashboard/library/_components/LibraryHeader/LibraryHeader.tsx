'use client';

import { Stack, Typography, Button } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PublishIcon from '@mui/icons-material/Publish';
import RefreshIcon from '@mui/icons-material/Refresh';
import PageIntro from '@/app/_lib/components/PageIntro';
import { LibraryVisibilityChip } from '../LibraryChips';
import {
  LIBRARY_TITLE,
  LIBRARY_DESCRIPTION,
  PUBLIC_VISIBILITY_LABEL,
  PRIVATE_VISIBILITY_LABEL,
} from './constants';
import type { LibraryHeaderProps } from './types';

export default function LibraryHeader({
  canManage,
  isFetching,
  onRefresh,
  onPublishClick,
}: LibraryHeaderProps) {
  return (
    <PageIntro
      title={LIBRARY_TITLE}
      description={LIBRARY_DESCRIPTION}
      icon={<LibraryBooksIcon color="primary" />}
      infoAriaLabel="About the library"
      actions={
        <>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={isFetching}
          >
            Refresh
          </Button>
          {canManage && (
            <Button
              variant="contained"
              size="small"
              startIcon={<PublishIcon />}
              onClick={onPublishClick}
            >
              Publish books
            </Button>
          )}
        </>
      }
    >
      <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ gap: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <LibraryVisibilityChip isPublic />
          <Typography variant="caption" color="text.secondary">
            {PUBLIC_VISIBILITY_LABEL}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <LibraryVisibilityChip isPublic={false} />
          <Typography variant="caption" color="text.secondary">
            {PRIVATE_VISIBILITY_LABEL}
          </Typography>
        </Stack>
      </Stack>
    </PageIntro>
  );
}
