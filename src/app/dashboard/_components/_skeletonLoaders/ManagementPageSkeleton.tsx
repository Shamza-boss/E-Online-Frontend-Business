'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import TabBarSkeleton from './primitives/TabBarSkeleton';
import DataGridSkeleton from './primitives/DataGridSkeleton';

export default function ManagementPageSkeleton() {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: 3,
      }}
    >
      <Box sx={{ flexShrink: 0, mb: 1 }}>
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={1.5}
          alignItems={{ xs: 'stretch', lg: 'center' }}
        >
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Skeleton variant="rounded" width={130} height={36} />
            <Skeleton variant="rounded" width={110} height={36} />
            <Skeleton variant="rounded" width={150} height={36} />
          </Stack>
          <Skeleton variant="rounded" height={40} sx={{ flex: 1, minWidth: { lg: 280 } }} />
        </Stack>
        <Skeleton variant="text" width="85%" height={20} sx={{ mt: 1.5, maxWidth: 720 }} />
      </Box>

      <Box sx={{ flex: '1 1 0%', display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <OutlinedWrapper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            width: '100%',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          <TabBarSkeleton tabs={2} />
          <Box sx={{ flex: 1, minHeight: 0, p: 0 }}>
            <DataGridSkeleton
              rows={10}
              columns={[20, 18, 16, 16, 14, 16]}
              showToolbar
              minHeight={480}
            />
          </Box>
        </OutlinedWrapper>
      </Box>
    </Box>
  );
}
