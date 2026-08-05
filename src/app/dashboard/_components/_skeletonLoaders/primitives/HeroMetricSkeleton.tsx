'use client';

import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

type HeroMetricSkeletonProps = {
  /** Slight variation so heroes don’t look identical. */
  valueWidth?: number | string;
};

export default function HeroMetricSkeleton({
  valueWidth = '42%',
}: HeroMetricSkeletonProps) {
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        flex: '1 1 140px',
        minWidth: 0,
        p: 1.75,
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={1}
      >
        <Skeleton variant="text" width="40%" height={16} />
        <Skeleton variant="rounded" width={16} height={16} />
      </Stack>
      <Skeleton variant="text" width={valueWidth} height={40} sx={{ mt: 0.5 }} />
      <Skeleton variant="text" width="70%" height={16} />
    </Paper>
  );
}
