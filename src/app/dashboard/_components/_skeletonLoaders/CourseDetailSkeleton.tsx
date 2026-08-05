'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import TabBarSkeleton from './primitives/TabBarSkeleton';

export default function CourseDetailSkeleton() {
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
      <Stack direction="row" spacing={1} sx={{ mb: 1, flexShrink: 0 }}>
        <Skeleton variant="rounded" width={160} height={36} />
        <Skeleton variant="rounded" width={120} height={36} />
      </Stack>

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
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
          <Box sx={{ flex: 1, minHeight: 0, p: 0, display: 'flex', flexDirection: 'column' }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                px: 2,
                py: 1,
                borderBottom: 1,
                borderColor: 'divider',
                flexShrink: 0,
              }}
            >
              <Skeleton variant="rounded" width={32} height={32} />
              <Skeleton variant="rounded" width={32} height={32} />
              <Skeleton variant="rounded" width={80} height={32} />
              <Box sx={{ flex: 1 }} />
              <Skeleton variant="rounded" width={100} height={32} />
            </Stack>
            <Box sx={{ flex: 1, p: 2, minHeight: 0 }}>
              <Paper
                variant="outlined"
                sx={{
                  height: '100%',
                  minHeight: 480,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                }}
              >
                <Stack spacing={2} alignItems="center" sx={{ width: '100%', px: 4 }}>
                  <Skeleton variant="circular" width={64} height={64} />
                  <Skeleton variant="text" width="40%" height={28} />
                  <Skeleton variant="rectangular" width="90%" height={360} sx={{ borderRadius: 1 }} />
                </Stack>
              </Paper>
            </Box>
          </Box>
        </OutlinedWrapper>
      </Box>
    </Box>
  );
}
