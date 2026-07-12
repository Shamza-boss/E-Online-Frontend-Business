// app/dashboard/studentmanagement/StudentClassesManagementClient.tsx
'use client';
import React, { useState, useCallback } from 'react';
import { Box, Button, Stack, Tooltip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { dashboardScrollablePageSx, dashboardSectionSpacing } from '@/app/_lib/layout/dashboardPageLayout';
import { type ClassroomDetailsDto } from '@/app/_lib/interfaces/types';
import PageIntro from '@/app/_lib/components/PageIntro';
import AssignStudentsToClassModal from './_components/Modals/AssignStudentsToClassModal';
import StudentClassesCards from './_components/Classes';

type Props = {
  fallbackClasses: ClassroomDetailsDto[];
};

export default function StudentClassesManagementClient({ fallbackClasses }: Props) {
  const [open, setOpen] = useState(false);

  const hasClasses = Array.isArray(fallbackClasses) && fallbackClasses.length > 0;

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const description = hasClasses ? (
    <>
      Select a course below to manage it, or use <strong>Enroll Students</strong> to add students to
      any of your courses.
    </>
  ) : (
    "You don't have any courses yet. Create a course to start enrolling students."
  );

  return (
    <Box sx={dashboardScrollablePageSx}>
      <Stack spacing={dashboardSectionSpacing}>
        <PageIntro
          description={description}
          infoAriaLabel="About manage courses"
          actions={
            <Tooltip
              title={
                hasClasses
                  ? 'Enroll students into your courses. Select a course and choose which students to add.'
                  : 'You need at least one course to enroll students. Create a course first.'
              }
            >
              <span>
                <Button
                  sx={{ maxWidth: 'max-content' }}
                  variant="contained"
                  size="small"
                  startIcon={<PersonAddIcon />}
                  onClick={handleOpen}
                  disabled={!hasClasses}
                >
                  Enroll Students
                </Button>
              </span>
            </Tooltip>
          }
        />
        <StudentClassesCards classes={fallbackClasses} />
      </Stack>
      <AssignStudentsToClassModal open={open} handleClose={handleClose} />
    </Box>
  );
}
