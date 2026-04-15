import type { BillingSummaryDto } from '@/app/_lib/interfaces/types';
import { format } from 'date-fns';

export function formatMonth(summary?: BillingSummaryDto): string {
  if (!summary) return '—';
  const date = new Date(summary.year, summary.month - 1, 1);
  return format(date, 'MMMM yyyy');
}

export function getMarginColor(billingDashboard?: {
  profitMarginPercent: number;
}): 'success' | 'warning' | 'error' {
  if (!billingDashboard) return 'error';
  if (billingDashboard.profitMarginPercent >= 75) return 'success';
  if (billingDashboard.profitMarginPercent >= 35) return 'warning';
  return 'error';
}
