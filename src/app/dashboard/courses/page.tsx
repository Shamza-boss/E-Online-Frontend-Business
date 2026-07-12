export const dynamic = 'force-dynamic';
import React, { Suspense } from 'react';
import { Box, Stack } from '@mui/material';
import { dashboardScrollablePageSx, dashboardSectionSpacing } from '@/app/_lib/layout/dashboardPageLayout';
import CoursesPageSkeleton from '../_components/_skeletonLoaders/CoursesPageSkeleton';
import ClassroomClasses from './_components/Classes';
import CoursesPageIntro from './_components/CoursesPageIntro';

export default function ClassroomPage() {
  return (
    <Box sx={dashboardScrollablePageSx}>
      <Stack spacing={dashboardSectionSpacing}>
        <CoursesPageIntro />
        <Suspense fallback={<CoursesPageSkeleton includeShell={false} />}>
          <ClassroomClasses />
        </Suspense>
      </Stack>
    </Box>
  );
}
