'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { Grid } from '@mui/material';
import { DashboardGrid, HeaderBox } from '../MainGrid/elements';
import StatCardSkeleton from './primitives/StatCardSkeleton';
import ChartCardSkeleton from './primitives/ChartCardSkeleton';
import DataGridSkeleton from './primitives/DataGridSkeleton';

export default function MainGridSkeleton() {
  return (
    <DashboardGrid container spacing={{ xs: 1.5, sm: 2 }} columns={12}>
      <Grid size={{ xs: 12 }}>
        <HeaderBox>
          <Skeleton variant="text" width={280} height={36} />
          <Skeleton variant="text" width={520} height={22} sx={{ mt: 0.5 }} />
        </HeaderBox>
      </Grid>

      {Array.from({ length: 4 }).map((_, index) => (
        <Grid key={`stat-${index}`} size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCardSkeleton />
        </Grid>
      ))}

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartCardSkeleton />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartCardSkeleton />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Box sx={{ minHeight: 400 }}>
          <DataGridSkeleton
            rows={6}
            columns={[24, 18, 16, 14, 14, 14]}
            showToolbar
            minHeight={400}
          />
        </Box>
      </Grid>
    </DashboardGrid>
  );
}
