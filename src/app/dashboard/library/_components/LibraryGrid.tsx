'use client';

import { Box, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { LibraryFileDto } from '@/app/_lib/interfaces/types';
import LibraryCard from './LibraryCard';

interface LibraryGridProps {
  files: LibraryFileDto[];
  isFetching: boolean;
  onRead: (file: LibraryFileDto) => void;
}

export default function LibraryGrid({
  files,
  isFetching,
  onRead,
}: LibraryGridProps) {
  if (isFetching && files.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '40vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (files.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No textbooks found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search or filters, or upload a new PDF from Publish
          books.
        </Typography>
      </Paper>
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
