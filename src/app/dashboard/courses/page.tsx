export const dynamic = 'force-dynamic';
import React, { Suspense } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import StudentClassCardSkeleton from '../_components/_skeletonLoaders/StudentClassCardSkeleton';
import ClassroomClasses from './_components/Classes';

export default function ClassroomPage() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Stack spacing={2}>
        <Suspense fallback={<StudentClassCardSkeleton count={12} />}>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 'max-content' }}>
            Select a course below to complete assessments, or capture notes in relation to provided training resources.
          </Typography>
          <ClassroomClasses />
        </Suspense>
      </Stack>
    </Box>
  );
}
