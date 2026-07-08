import type {
  InstitutionBillingDashboardDto,
  InstitutionWithAdminDto,
} from '@/app/_lib/interfaces/types';

export interface InstitutionOption {
  id: string;
  name: string;
  isActive: boolean;
  adminEmail?: string | null;
}

export interface BillingExperienceProps {
  initialInstitutions?: InstitutionWithAdminDto[];
  initialInstitutionId?: string;
  initialBillingDashboard?: InstitutionBillingDashboardDto;
}
