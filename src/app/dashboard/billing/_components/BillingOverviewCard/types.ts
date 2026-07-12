import type {
  BillingSummaryDto,
  InstitutionBillingDashboardDto,
} from '@/app/_lib/interfaces/types';

export type BillingOverviewCardProps = {
  summary?: BillingSummaryDto;
  billingDashboard?: InstitutionBillingDashboardDto;
  loading?: boolean;
  institutionName?: string;
}
