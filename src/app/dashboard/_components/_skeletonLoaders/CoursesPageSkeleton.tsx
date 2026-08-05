'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import {
  dashboardPageRootSx,
  dashboardSectionSpacing,
} from '@/app/_lib/layout/dashboardPageLayout';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import StudentClassCardSkeleton from './StudentClassCardSkeleton';

type CoursesPageSkeletonProps = {
  includeShell?: boolean;
};

function CardsPanelSkeleton() {
  return (
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
  );
}

export default function CoursesPageSkeleton({ includeShell = true }: CoursesPageSkeletonProps) {
  if (!includeShell) {
    return <CardsPanelSkeleton />;
  }

  return (
    <Box sx={{ ...dashboardPageRootSx, gap: dashboardSectionSpacing }}>
      <Box sx={{ flexShrink: 0 }}>
        <Skeleton variant="text" width="95%" height={20} sx={{ maxWidth: 720 }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ maxWidth: 640 }} />
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
        <CardsPanelSkeleton />
      </Box>
    </Box>
  );
}
