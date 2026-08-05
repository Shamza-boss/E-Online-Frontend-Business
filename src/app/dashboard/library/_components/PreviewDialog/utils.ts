import type { FileDto, LibraryFileDto } from '@/app/_lib/interfaces/types';

export function getLinkedClassrooms(file: FileDto): LibraryFileDto['linkedClassrooms'] {
  return 'linkedClassrooms' in file
    ? (file as LibraryFileDto).linkedClassrooms ?? []
    : [];
}

export function buildCourseUrl(classroom: { id: string; name: string }): string {
  return `/dashboard/courses/${encodeURIComponent(`${classroom.name}~${classroom.id}`)}`;
}
