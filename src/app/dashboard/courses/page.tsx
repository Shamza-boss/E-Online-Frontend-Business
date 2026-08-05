export const dynamic = 'force-dynamic';
import React, { Suspense } from 'react';
import { Box } from '@mui/material';
import {
  dashboardPageRootSx,
  dashboardSectionSpacing,
} from '@/app/_lib/layout/dashboardPageLayout';
import CoursesPageSkeleton from '../_components/_skeletonLoaders/CoursesPageSkeleton';
import ClassroomClasses from './_components/Classes';
import CoursesPageIntro from './_components/CoursesPageIntro';

export default function ClassroomPage() {
  return (
    <Box
      sx={{
        ...dashboardPageRootSx,
        gap: dashboardSectionSpacing,
      }}
    >
      <Box sx={{ flexShrink: 0, width: '100%', minWidth: 0 }}>
        <CoursesPageIntro />
      </Box>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Suspense fallback={<CoursesPageSkeleton includeShell={false} />}>
          <ClassroomClasses />
        </Suspense>
      </Box>
    </Box>
  );
}
