import type {
  BillingProjectionDto,
  InstitutionBillingDashboardDto,
} from '@/app/_lib/interfaces/types';

export type BillingProjectionPanelProps = {
  projection?: BillingProjectionDto;
  billingDashboard?: InstitutionBillingDashboardDto;
  loading?: boolean;
  error?: Error;
  onRefresh?: () => void;
}
