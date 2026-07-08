import type { UserDto } from '@/app/_lib/interfaces/types';

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

export function getDeleteDialogTitle(deleteTarget: UserDto | null): string {
  if (!deleteTarget) {
    return 'Remove person';
  }

  const displayName =
    `${deleteTarget.firstName ?? ''} ${deleteTarget.lastName ?? ''}`.trim() ||
    deleteTarget.email ||
    'person';

  return `Remove ${displayName}`;
}

export function getRowClassName(
  params: { indexRelativeToCurrentPage: number; row: { userId: string } },
  deletingRowId: string | null,
): string {
  const classes = [];
  if (params.indexRelativeToCurrentPage % 2 === 0) {
    classes.push('even');
  } else {
    classes.push('odd');
  }
  if (deletingRowId === params.row.userId) {
    classes.push('row-deleted');
  }
  return classes.join(' ');
}
