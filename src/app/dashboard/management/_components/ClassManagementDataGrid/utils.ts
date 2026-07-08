import type { ClassroomDetailsDto } from '@/app/_lib/interfaces/types';

export function sanitizeOptionalInput(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const lower = trimmed.toLowerCase();
  if (
    lower === 'undefined' ||
    lower === 'null' ||
    lower === '$undefined' ||
    lower === '$null'
  ) {
    return undefined;
  }

  return trimmed;
}

export function buildLabelMap(
  options: Array<{ value: string; label: string }>,
): Map<string, string> {
  const map = new Map<string, string>();
  options.forEach((opt) => {
    map.set(opt.value, opt.label);
  });
  return map;
}

export function normalizeClassroomRows(
  items: ClassroomDetailsDto[] | undefined,
): ClassroomDetailsDto[] {
  return (items ?? []).map((row) => ({
    ...row,
    teacherId: row.teacherId ?? '',
    academicLevelId: row.academicLevelId ?? '',
    subjectId: row.subjectId ?? '',
  }));
}

export function getRowClassName(
  params: { indexRelativeToCurrentPage: number; row: { classroomId: string } },
  deletingRowId: string | null,
): string {
  const classes = [];
  if (params.indexRelativeToCurrentPage % 2 === 0) {
    classes.push('even');
  } else {
    classes.push('odd');
  }
  if (deletingRowId === params.row.classroomId) {
    classes.push('row-deleted');
  }
  return classes.join(' ');
}
