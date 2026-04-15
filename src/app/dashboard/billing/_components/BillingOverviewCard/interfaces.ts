import type {
  BillingSummaryDto,
  InstitutionBillingDashboardDto,
} from '@/app/_lib/interfaces/types';

export interface BillingOverviewCardProps {
  summary?: BillingSummaryDto;
  billingDashboard?: InstitutionBillingDashboardDto;
  loading?: boolean;
  institutionName?: string;
}
