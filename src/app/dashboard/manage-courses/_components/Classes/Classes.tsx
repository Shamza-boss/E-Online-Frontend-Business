'use client';

import React from 'react';
import ClassCard from '@/app/_lib/components/shared-theme/customizations/card';
import { SchoolRounded } from '@mui/icons-material';
import type { Route } from 'next';
import ErrorLayout from '../../../_components/ErrorLayout';
import { ClassesGrid, CardWrapper } from './elements';
import type { StudentClassesCardsProps } from './types';

function courseHref(
  classItem: StudentClassesCardsProps['classes'][number],
): Route {
  return `/dashboard/manage-courses/${encodeURIComponent(
    `${classItem.classroomName}~${classItem.classroomId}`,
  )}` as Route;
}

function StudentClassesCards({ classes }: StudentClassesCardsProps) {
  if (classes.length === 0) {
    return (
      <ErrorLayout
        icon={<SchoolRounded sx={{ fontSize: 80 }} />}
        title="No courses Found"
        description="You are not enrolled into any courses yet. Please contact your administrator or institution for access."
        actionLabel="Go to management?"
        actionHref="/dashboard/management"
        tone="info"
      />
    );
  }

  return (
    <ClassesGrid>
      {classes.map((classItem) => (
        <CardWrapper key={classItem.classroomId}>
          <ClassCard
            href={courseHref(classItem)}
            className={classItem.classroomName}
            teacherNameAbb={`${classItem.teacherLastName ?? ''} ${classItem.teacherFirstName?.charAt(0) ?? ''}`.trim()}
            subjectName={classItem.subjectName}
            academicLevelName={classItem.academicLevelName}
          />
        </CardWrapper>
      ))}
    </ClassesGrid>
  );
}

export default React.memo(StudentClassesCards);
