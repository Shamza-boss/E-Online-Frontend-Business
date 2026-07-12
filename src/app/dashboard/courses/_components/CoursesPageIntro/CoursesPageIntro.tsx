'use client';

import PageIntro from '@/app/_lib/components/PageIntro';
import { COURSES_DESCRIPTION, COURSES_INFO_LABEL } from './constants';

export default function CoursesPageIntro() {
  return (
    <PageIntro
      description={COURSES_DESCRIPTION}
      infoAriaLabel={COURSES_INFO_LABEL}
    />
  );
}
