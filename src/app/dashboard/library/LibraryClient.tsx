'use client';

import type { AcademicLevelDto } from '@/app/_lib/interfaces/types';
import LibraryView from './_components/LibraryView';

export type LibraryClientProps = {
  initialAcademics: AcademicLevelDto[];
}

export default function LibraryClient({ initialAcademics }: LibraryClientProps) {
  return <LibraryView initialAcademics={initialAcademics} />;
}
