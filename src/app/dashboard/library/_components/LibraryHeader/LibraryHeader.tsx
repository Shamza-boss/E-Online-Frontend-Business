'use client';

import { Stack, Typography, Button, Box } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PublishIcon from '@mui/icons-material/Publish';
import RefreshIcon from '@mui/icons-material/Refresh';
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
    <Box sx={{ mb: 4 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LibraryBooksIcon color="primary" />
          <Typography variant="h4" fontWeight={600}>
            {LIBRARY_TITLE}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={isFetching}
          >
            Refresh
          </Button>
          {canManage && (
            <Button
              variant="contained"
              startIcon={<PublishIcon />}
              onClick={onPublishClick}
            >
              Publish books
            </Button>
          )}
        </Stack>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 'max-content' }}>
        {LIBRARY_DESCRIPTION}
      </Typography>

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
    </Box>
  );
}
