import { getAllUserClassrooms } from '@/app/_lib/actions/classrooms';
import ClassCard from '@/app/_lib/components/shared-theme/customizations/card';
import { ClassroomDetailsDto } from '@/app/_lib/interfaces/types';
import Box from '@mui/material/Box';
import { SchoolRounded } from '@mui/icons-material';
import ErrorLayout from '../../_components/ErrorLayout';
import Link from 'next/link';

export default async function ClassroomClasses() {
  let classes: ClassroomDetailsDto[] = [];

  try {
    const result = await getAllUserClassrooms();
    classes = Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Unable to load classrooms', error);
    return (
      <ErrorLayout
        icon={<SchoolRounded sx={{ fontSize: 80 }} />}
        title="Courses unavailable"
        description="We couldn't load your courses just now. Please refresh the page."
        actionLabel="Back to Dashboard"
        actionHref="/dashboard"
        tone="error"
      />
    );
  }

  if (classes.length === 0) {
    return (
      <ErrorLayout
        icon={<SchoolRounded sx={{ fontSize: 80 }} />}
        title="No courses Found"
        description="You are not enrolled into any courses yet. Please contact your instructor or institution for access."
        actionLabel="Back to Dashboard"
        actionHref="/dashboard"
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
              `/dashboard/courses/${encodeURIComponent(`${classItem.classroomName}~${classItem.classroomId}`)}` as any
            }
          >
            <ClassCard
              className={classItem.classroomName}
              teacherNameAbb={`${classItem.teacherLastName} ${classItem.teacherFirstName.charAt(0)}`}
              subjectName={classItem.subjectName}
              academicLevelName={classItem.academicLevelName}
            />
          </Link>
        </Box>
      ))}
    </Box>
  );
}
