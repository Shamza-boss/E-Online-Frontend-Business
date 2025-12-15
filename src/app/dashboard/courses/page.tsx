export const dynamic = 'force-dynamic';
import React, { Suspense } from 'react';
import { Box, Stack } from '@mui/material';
import StudentClassCardSkeleton from '../_components/_skeletonLoaders/StudentClassCardSkeleton';
import ClassroomClasses from './_components/Classes';

export default function ClassroomPage() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Stack spacing={2}>
        <Suspense fallback={<StudentClassCardSkeleton count={12} />}>
          <ClassroomClasses />
        </Suspense>
      </Stack>
    </Box>
  );
}
