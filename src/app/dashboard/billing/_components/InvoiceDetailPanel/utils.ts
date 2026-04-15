import { format } from 'date-fns';

export function formatDate(iso: string | null) {
  if (!iso) return '—';
  return format(new Date(iso), 'dd MMM yyyy, HH:mm');
}

export function formatBillingPeriod(year: number, month: number) {
  return format(new Date(year, month - 1, 1), 'MMMM yyyy');
}
