'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { dashboardScrollablePageSx, dashboardSectionSpacing } from '@/app/_lib/layout/dashboardPageLayout';
import StudentClassCardSkeleton from './StudentClassCardSkeleton';

export default function ManageCoursesPageSkeleton() {
  return (
    <Box sx={dashboardScrollablePageSx}>
      <Stack spacing={dashboardSectionSpacing}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rounded" width={160} height={36} />
          </Stack>
          <Skeleton variant="text" width="90%" height={20} sx={{ maxWidth: 720 }} />
          <Skeleton variant="text" width="75%" height={20} sx={{ maxWidth: 640 }} />
        </Box>
        <StudentClassCardSkeleton count={8} />
      </Stack>
    </Box>
  );
}
