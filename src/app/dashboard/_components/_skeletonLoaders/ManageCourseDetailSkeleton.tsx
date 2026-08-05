'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import TabBarSkeleton from './primitives/TabBarSkeleton';
import DataGridSkeleton from './primitives/DataGridSkeleton';

export default function ManageCourseDetailSkeleton() {
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
        <Stack direction="row" spacing={1}>
          <Skeleton variant="rounded" width={140} height={36} />
        </Stack>
        <Skeleton variant="text" width="85%" height={20} sx={{ mt: 1, maxWidth: 680 }} />
      </Box>

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
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
          <TabBarSkeleton tabs={2} showIcons={false} />
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <DataGridSkeleton
              rows={10}
              columns={[28, 18, 14, 14, 14, 12]}
              showToolbar
              minHeight={520}
            />
          </Box>
        </OutlinedWrapper>
      </Box>
    </Box>
  );
}
