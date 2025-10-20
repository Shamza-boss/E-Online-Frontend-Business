'use client';
import { getAllUserClassrooms } from '@/app/_lib/actions/classrooms';
import ClassCard from '@/app/_lib/components/shared-theme/customizations/card';
import { ClassroomDetailsDto } from '@/app/_lib/interfaces/types';
import { SchoolRounded } from '@mui/icons-material';
import { Box } from '@mui/material';
import Link from 'next/link';
import useSWR from 'swr';
import ErrorLayout from '../../_components/ErrorLayout';

export default function StudentClassesCards() {
  const { data: result } = useSWR<ClassroomDetailsDto[]>(
    'classes',
    getAllUserClassrooms,
    { suspense: true }
  );

  const classes = Array.isArray(result) ? result : [];

  if (classes.length === 0) {
    return (
      <ErrorLayout
        icon={<SchoolRounded sx={{ fontSize: 80 }} />}
        title="No courses Found"
        description="You are not enrolled into any courses yet. Please contact your administrator or institution for access."
        actionLabel="Go to management?"
        actionHref="/management"
        tone="info"
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 2,
      }}
    >
      {classes.map((classItem) => (
        <Box
          key={classItem.classroomId}
          sx={{
            width: '100%',
          }}
        >
          <Link
            style={{ textDecoration: 'none' }}
            href={
              `/dashboard/manage-courses/${encodeURIComponent(`${classItem.classroomName}~${classItem.classroomId}`)}` as any
            }
          >
            <ClassCard
              className={classItem.classroomName}
              teacherNameAbb={`${classItem.teacherLastName ?? ''} ${classItem.teacherFirstName?.charAt(0) ?? ''}`.trim()}
              subjectName={classItem.subjectName}
              academicLevelName={classItem.academicLevelName}
            />
          </Link>
        </Box>
      ))}
    </Box>
  );
}
