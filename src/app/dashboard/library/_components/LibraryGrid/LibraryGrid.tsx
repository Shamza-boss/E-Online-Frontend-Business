'use client';

import { CircularProgress, Grid, Typography } from '@mui/material';
import LibraryCard from '../LibraryCard';
import { EMPTY_TITLE, EMPTY_DESCRIPTION } from './constants';
import { LoadingContainer, EmptyStatePaper } from './elements';
import type { LibraryGridProps } from './interfaces';

export default function LibraryGrid({
  files,
  isFetching,
  onRead,
}: LibraryGridProps) {
  if (isFetching && files.length === 0) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (files.length === 0) {
    return (
      <EmptyStatePaper>
        <Typography variant="h6" gutterBottom>
          {EMPTY_TITLE}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {EMPTY_DESCRIPTION}
        </Typography>
      </EmptyStatePaper>
    );
  }

  return (
    <Grid container spacing={2} columns={12}>
      {files.map((file) => (
        <Grid key={file.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <LibraryCard file={file} onRead={onRead} />
        </Grid>
      ))}
    </Grid>
  );
}
