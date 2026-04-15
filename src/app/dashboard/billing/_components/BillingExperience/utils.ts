import { UserRole } from '@/app/_lib/Enums/UserRole';
import type { InstitutionWithAdminDto } from '@/app/_lib/interfaces/types';
import type { InstitutionOption } from './interfaces';

export function normalizeRole(raw: unknown): UserRole | undefined {
  if (typeof raw === 'string') return parseInt(raw, 10) as UserRole;
  return raw as UserRole | undefined;
}

export function buildInstitutionOptions(
  entries?: InstitutionWithAdminDto[]
): InstitutionOption[] {
  if (!entries) return [];
  return entries
    .filter((entry) => entry.institution?.id && entry.institution?.name)
    .map((entry) => ({
      id: entry.institution!.id,
      name: entry.institution!.name,
      isActive: entry.institution!.isActive,
      adminEmail: entry.admin?.email ?? entry.institution!.adminEmail,
    }));
}
