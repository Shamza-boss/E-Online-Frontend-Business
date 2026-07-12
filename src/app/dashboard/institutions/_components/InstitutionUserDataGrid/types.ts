import type { InstitutionWithAdminDto, SubscriptionPlan } from '@/app/_lib/interfaces/types';
import type { PagedResult } from '@/app/_lib/interfaces/pagination';

export type InstitutionUserDataGridProps = {
  initialInstitutionsPage?: PagedResult<InstitutionWithAdminDto>;
}

export type InstitutionGridRow = {
  id: string;
  name: string;
  adminEmail: string;
  isActive: boolean;
  updatedAt?: string | null;
  adminFirstName?: string;
  adminLastName?: string;
  adminName: string;
  plan: SubscriptionPlan;
  creatorEnabled?: boolean;
};
