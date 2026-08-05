'use client';

import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

type InsightSummaryCardSkeletonProps = {
  chartHeight?: number;
};

export default function InsightSummaryCardSkeleton({
  chartHeight = 100,
}: InsightSummaryCardSkeletonProps) {
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        minWidth: 0,
        minHeight: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 1.5,
        px: 1.75,
        borderRadius: (theme) =>
          `${Number(theme.shape.borderRadius) * 1.5}px`,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 0.5 }}
      >
        <Skeleton variant="text" width="45%" height={20} />
        <Skeleton variant="rounded" width={16} height={16} />
      </Stack>
      <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 0.5 }}>
        <Skeleton variant="text" width={56} height={36} />
        <Skeleton variant="text" width={88} height={16} />
      </Stack>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Skeleton
          variant="rounded"
          width="100%"
          height={chartHeight}
          sx={{ borderRadius: 1 }}
        />
      </Box>
    </Paper>
  );
}
