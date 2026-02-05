// app/dashboard/studentmanagement/StudentClassesManagementClient.tsx
'use client';
import React, { useState, useCallback } from 'react';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { ClassroomDetailsDto } from '@/app/_lib/interfaces/types';
import AssignStudentsToClassModal from './_components/Modals/AssignStudentsToClassModal';
import StudentClassesCards from './_components/Classes';

interface Props {
  fallbackClasses: ClassroomDetailsDto[];
}

export default function StudentClassesManagementClient({ fallbackClasses }: Props) {
  const [open, setOpen] = useState(false);

  // Use the prefetched data directly - no need for SWR here since Classes component handles it
  const hasClasses = Array.isArray(fallbackClasses) && fallbackClasses.length > 0;

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Stack spacing={2} direction={'row'}>
            <Tooltip title={hasClasses 
              ? "Enroll students into your courses. Select a course and choose which students to add."
              : "You need at least one course to enroll students. Create a course first."
            }>
              <span>
                <Button
                  sx={{ maxWidth: 'max-content' }}
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={handleOpen}
                  disabled={!hasClasses}
                >
                  Enroll Students
                </Button>
              </span>
            </Tooltip>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 'max-content' }}>
            {hasClasses 
              ? <>Select a course below to manage it, or use <strong>Enroll Students</strong> to add students to any of your courses.</>
              : "You don't have any courses yet. Create a course to start enrolling students."
            }
          </Typography>
        </Box>
        <StudentClassesCards classes={fallbackClasses} />
      </Stack>
      {/* Modal rendered outside the main content flow to prevent re-renders */}
      <AssignStudentsToClassModal
        open={open}
        handleClose={handleClose}
      />
    </Box>
  );
}
