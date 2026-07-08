'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Grid } from '@mui/material';
import DataGridSkeleton from './primitives/DataGridSkeleton';

function BillingMetricSkeleton() {
  return (
    <Stack spacing={0.5}>
      <Skeleton variant="text" width="70%" height={16} />
      <Skeleton variant="text" width="50%" height={32} />
    </Stack>
  );
}

export default function BillingPageSkeleton() {
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Box>
        <Skeleton variant="text" width={280} height={44} />
        <Skeleton variant="text" width="85%" height={24} sx={{ maxWidth: 720 }} />
      </Box>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width="60%" height={22} />
        </Stack>
      </Paper>

      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-end' }}>
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <Skeleton variant="text" width={90} height={18} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" height={56} />
          </Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ pb: { md: '23px' } }}>
            <Skeleton variant="rounded" width={72} height={24} sx={{ borderRadius: 12 }} />
            <Skeleton variant="rounded" width={88} height={32} />
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Skeleton variant="rounded" width={160} height={36} />
          <Skeleton variant="rounded" width={180} height={36} />
        </Stack>
      </Stack>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Skeleton variant="text" width={180} height={18} />
            <Skeleton variant="text" width={280} height={36} sx={{ mt: 0.5 }} />
          </Box>
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={120} height={28} sx={{ borderRadius: 14 }} />
            <Skeleton variant="rounded" width={90} height={28} sx={{ borderRadius: 14 }} />
          </Stack>
          <Grid container spacing={2}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Grid key={index} size={{ xs: 6, sm: 4, md: 2.4 }}>
                <BillingMetricSkeleton />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Skeleton variant="text" width={160} height={28} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="70%" height={20} sx={{ mb: 2 }} />
        <Stack direction="row" spacing={2} alignItems="center">
          <Skeleton variant="rounded" width={48} height={28} />
          <Skeleton variant="text" width={200} height={20} />
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Skeleton variant="text" width={200} height={28} />
          <Skeleton variant="circular" width={32} height={32} />
        </Stack>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="40%" height={28} sx={{ mt: 1 }} />
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
      </Paper>

      <DataGridSkeleton
        rows={6}
        columns={[14, 16, 14, 12, 12, 12, 20]}
        showToolbar
        minHeight={360}
      />
    </Stack>
  );
}
