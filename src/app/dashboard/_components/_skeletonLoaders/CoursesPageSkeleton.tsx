'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { dashboardScrollablePageSx, dashboardSectionSpacing } from '@/app/_lib/layout/dashboardPageLayout';
import StudentClassCardSkeleton from './StudentClassCardSkeleton';

type CoursesPageSkeletonProps = {
  includeShell?: boolean;
}

export default function CoursesPageSkeleton({ includeShell = true }: CoursesPageSkeletonProps) {
  const content = (
    <Stack spacing={dashboardSectionSpacing}>
      <Skeleton variant="text" width="95%" height={20} sx={{ maxWidth: 720 }} />
      <Skeleton variant="text" width="80%" height={20} sx={{ maxWidth: 640 }} />
      <StudentClassCardSkeleton count={8} />
    </Stack>
  );

  if (!includeShell) {
    return content;
  }

  return <Box sx={dashboardScrollablePageSx}>{content}</Box>;
}
