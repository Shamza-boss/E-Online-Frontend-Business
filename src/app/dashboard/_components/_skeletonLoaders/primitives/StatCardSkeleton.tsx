'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function StatCardSkeleton() {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Skeleton variant="text" width="55%" height={22} />
        <Stack spacing={1} sx={{ mt: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Skeleton variant="text" width="45%" height={36} />
            <Skeleton variant="rounded" width={64} height={24} sx={{ borderRadius: 12 }} />
          </Stack>
          <Skeleton variant="text" width="35%" height={16} />
          <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 1, mt: 0.5 }} />
        </Stack>
      </CardContent>
    </Card>
  );
}
