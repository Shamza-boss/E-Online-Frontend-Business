export const dynamic = 'force-dynamic';
import React, { Suspense } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { dashboardScrollablePageSx, dashboardSectionSpacing } from '@/app/_lib/layout/dashboardPageLayout';
import CoursesPageSkeleton from '../_components/_skeletonLoaders/CoursesPageSkeleton';
import ClassroomClasses from './_components/Classes';

export default function ClassroomPage() {
  return (
    <Box sx={dashboardScrollablePageSx}>
      <Stack spacing={dashboardSectionSpacing}>
        <Suspense fallback={<CoursesPageSkeleton includeShell={false} />}>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 'max-content' }}>
            Select a course below to complete assessments, or capture notes in relation to provided training resources.
          </Typography>
          <ClassroomClasses />
        </Suspense>
      </Stack>
    </Box>
  );
}
