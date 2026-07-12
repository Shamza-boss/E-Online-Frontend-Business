import type { InstitutionWithAdminDto } from '@/app/_lib/interfaces/types';
import { featureFlagToPlan } from '@/app/_lib/utils/subscriptions';
import type { InstitutionGridRow } from './types';

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

export function mapInstitutionsToRows(
  items: InstitutionWithAdminDto[] | undefined,
): InstitutionGridRow[] {
  if (!items) {
    return [];
  }

  return items
    .filter((entry) => entry.institution?.id)
    .map((entry) => {
      const { institution, admin } = entry;
      const adminEmail = admin?.email ?? institution.adminEmail ?? '';
      const adminName = [admin?.firstName, admin?.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();

      const normalizedPlan = featureFlagToPlan(institution.plan);

      return {
        id: institution.id,
        name: institution.name,
        adminEmail,
        adminName,
        isActive: Boolean(institution.isActive),
        updatedAt: institution.updatedAt,
        adminFirstName: admin?.firstName ?? '',
        adminLastName: admin?.lastName ?? '',
        plan: normalizedPlan,
        creatorEnabled: Boolean(institution.creatorEnabled),
      };
    });
}

export function getRowClassName(indexRelativeToCurrentPage: number): string {
  return indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';
}
