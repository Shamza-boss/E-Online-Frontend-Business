// app/dashboard/studentmanagement/StudentClassesManagementClient.tsx
'use client';
import React, { Suspense, useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import AssignStudentsToClassModal from './_components/Modals/AssignStudentsToClassModal';
import StudentClassesCards from './_components/Classes';
import StudentClassCardSkeleton from '../_components/_skeletonLoaders/StudentClassCardSkeleton';

export default function StudentClassesManagementClient() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <AssignStudentsToClassModal
        open={open}
        handleClose={() => setOpen(false)}
      />
      <Stack spacing={2}>
        <Stack spacing={2} direction={'row'}>
          <Button
            sx={{ maxWidth: 'max-content' }}
            variant="outlined"
            onClick={() => setOpen(true)}
          >
            Manage trainees
          </Button>
        </Stack>
        <Suspense fallback={<StudentClassCardSkeleton count={4} />}>
          <StudentClassesCards />
        </Suspense>
      </Stack>
    </Box>
  );
}
