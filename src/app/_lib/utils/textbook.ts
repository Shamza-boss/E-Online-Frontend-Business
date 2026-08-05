import { type FileDto, type LibraryFileDto } from '../interfaces/types';

export type TextbookSelection = {
  key: string;
  hash: string;
  url: string;
  fileName?: string;
  fileSizeBytes?: number;
  previewImageKey?: string;
  previewImageUrl?: string;
  uploadedAt?: string;
  uploadedByUserId?: string;
}

export function getFileSizeBytes(file: FileDto): number | undefined {
  const size = file.fileSizeBytes ?? file.sizeBytes;
  return size != null ? Number(size) : undefined;
}

export function fileDtoToTextbookSelection(file: FileDto): TextbookSelection {
  return {
    key: file.fileKey,
    hash: file.hash,
    url: file.url,
    fileName: file.fileName ?? undefined,
    fileSizeBytes: getFileSizeBytes(file),
    previewImageKey: file.previewImageKey ?? undefined,
    previewImageUrl: file.previewImageUrl ?? undefined,
    uploadedAt: file.uploadedAt ?? undefined,
    uploadedByUserId: file.uploadedByUserId ?? undefined,
  };
}

export function formatTextbookFileSize(bytes: number): string {
  if (!bytes) return '0 KB';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function extractTextbookName(file: FileDto): string {
  if (file.fileName) return file.fileName;
  return file.fileKey.split('_').pop() ?? file.fileKey;
}

export function formatLinkedCoursesSummary(
  file: LibraryFileDto
): string {
  const linked = file.linkedClassrooms ?? [];
  if (linked.length === 0) return 'Not linked to a course';
  if (linked.length === 1) {
    const c = linked[0];
    if (!c) return 'Not linked to a course';
    const grade = c.academicLevelName ? `${c.academicLevelName} · ` : '';
    return `${grade}${c.name}`;
  }
  return `${linked.length} courses`;
}

export function formatLinkedCoursesTooltip(file: LibraryFileDto): string {
  const linked = file.linkedClassrooms ?? [];
  if (linked.length === 0) return 'This textbook is not linked to any course yet.';
  return linked
    .map((c) => {
      const parts = [c.name];
      if (c.academicLevelName) parts.push(c.academicLevelName);
      if (c.subjectName) parts.push(c.subjectName);
      return parts.join(' · ');
    })
    .join('\n');
}

export function formatLinkedCoursesDisplay(file: LibraryFileDto): string {
  const linked = file.linkedClassrooms ?? [];
  if (linked.length === 0) return 'Not linked';
  if (linked.length === 1) {
    const classroom = linked[0];
    return classroom?.name ?? 'Not linked';
  }
  return `${linked.length} courses`;
}
