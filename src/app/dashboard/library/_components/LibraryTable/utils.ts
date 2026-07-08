import type { LibraryFileDto } from '@/app/_lib/interfaces/types';

export function buildCourseUrl(classroom: { id: string; name: string }): string {
  return `/dashboard/courses/${encodeURIComponent(`${classroom.name}~${classroom.id}`)}`;
}

export function gradesLabel(file: LibraryFileDto): string {
  const grades = [
    ...new Set(
      (file.linkedClassrooms ?? [])
        .map((c) => c.academicLevelName)
        .filter(Boolean)
    ),
  ];
  return grades.length ? grades.join(', ') : '—';
}
