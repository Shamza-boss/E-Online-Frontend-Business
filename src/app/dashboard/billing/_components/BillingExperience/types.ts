import type {
  InstitutionBillingDashboardDto,
  InstitutionWithAdminDto,
} from '@/app/_lib/interfaces/types';

export type InstitutionOption = {
  id: string;
  name: string;
  isActive: boolean;
  adminEmail?: string | null;
}

export type BillingExperienceProps = {
  initialInstitutions?: InstitutionWithAdminDto[];
  initialInstitutionId?: string;
  initialBillingDashboard?: InstitutionBillingDashboardDto;
}
