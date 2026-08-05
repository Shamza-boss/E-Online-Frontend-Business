'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import {
  dashboardPageRootSx,
  dashboardSectionSpacing,
} from '@/app/_lib/layout/dashboardPageLayout';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import StudentClassCardSkeleton from './StudentClassCardSkeleton';

export default function ManageCoursesPageSkeleton() {
  return (
    <Box sx={{ ...dashboardPageRootSx, gap: dashboardSectionSpacing }}>
      <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rounded" width={160} height={36} />
        </Stack>
        <Skeleton variant="text" width="90%" height={20} sx={{ maxWidth: 720 }} />
        <Skeleton variant="text" width="75%" height={20} sx={{ maxWidth: 640 }} />
      </Box>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <OutlinedWrapper
          sx={{
            flex: 1,
            width: '100%',
            minHeight: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: 2, pb: 3 }}>
            <StudentClassCardSkeleton count={8} />
          </Box>
        </OutlinedWrapper>
      </Box>
    </Box>
  );
}
