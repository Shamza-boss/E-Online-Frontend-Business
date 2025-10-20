export const dynamic = 'force-dynamic';
import React, { Suspense } from 'react';
import { Box, Stack } from '@mui/material';
import StudentClassCardSkeleton from '../_components/_skeletonLoaders/StudentClassCardSkeleton';
import { SWRConfig } from 'swr';
import ClassroomClasses from './_components/Classes';
import { getAllUserClassrooms } from '@/app/_lib/actions/classrooms';

export default function ClassroomPage() {
  const classes = getAllUserClassrooms();
  return (
    <SWRConfig value={{ suspense: true, fallback: { classes } }}>
      <Box sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          <Suspense fallback={<StudentClassCardSkeleton count={12} />}>
            <ClassroomClasses />
          </Suspense>
        </Stack>
      </Box>
    </SWRConfig>
  );
}
