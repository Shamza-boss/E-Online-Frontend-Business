'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

interface ChartCardSkeletonProps {
  chartHeight?: number;
}

export default function ChartCardSkeleton({ chartHeight = 250 }: ChartCardSkeletonProps) {
  return (
    <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Stack spacing={0.5} sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="85%" height={18} />
          </Stack>
          <Skeleton variant="rounded" width={72} height={24} sx={{ borderRadius: 12 }} />
        </Stack>
        <Skeleton variant="rectangular" height={chartHeight} sx={{ borderRadius: 1 }} />
      </CardContent>
    </Card>
  );
}
