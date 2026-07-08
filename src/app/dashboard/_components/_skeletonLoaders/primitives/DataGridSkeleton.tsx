'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

interface DataGridSkeletonProps {
  rows?: number;
  columns?: number[];
  showToolbar?: boolean;
  minHeight?: number;
}

export default function DataGridSkeleton({
  rows = 8,
  columns = [18, 22, 16, 14, 12, 10],
  showToolbar = false,
  minHeight = 420,
}: DataGridSkeletonProps) {
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight,
        overflow: 'hidden',
        borderRadius: 1,
      }}
    >
      {showToolbar ? (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <Skeleton variant="rounded" width={140} height={36} />
          <Box sx={{ flex: 1 }} />
          <Skeleton variant="rounded" width={200} height={36} />
        </Box>
      ) : null}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: columns.map((w) => `${w}%`).join(' '),
          gap: 2,
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'action.hover',
        }}
      >
        {columns.map((width, index) => (
          <Skeleton key={`header-${index}`} variant="text" width={`${width * 0.7}%`} height={20} />
        ))}
      </Box>

      <Stack sx={{ flex: 1, overflow: 'hidden' }}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Box
            key={`row-${rowIndex}`}
            sx={{
              display: 'grid',
              gridTemplateColumns: columns.map((w) => `${w}%`).join(' '),
              gap: 2,
              px: 2,
              py: 1.25,
              borderBottom: 1,
              borderColor: 'divider',
              alignItems: 'center',
            }}
          >
            {columns.map((width, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                variant="text"
                width={colIndex === 0 ? '75%' : `${width * 0.85}%`}
                height={18}
              />
            ))}
          </Box>
        ))}
      </Stack>

      <Box
        sx={{
          px: 2,
          py: 1,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="rounded" width={32} height={32} />
        <Skeleton variant="rounded" width={32} height={32} />
      </Box>
    </Paper>
  );
}
