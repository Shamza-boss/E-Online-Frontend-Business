import { format } from 'date-fns';
import { formatSaDateTime } from '@/app/_lib/utils/datetime';

export function formatDate(iso: string | null) {
  if (!iso) return '—';
  return formatSaDateTime(iso, '—');
}

export function formatBillingPeriod(year: number, month: number) {
  return format(new Date(year, month - 1, 1), 'MMMM yyyy');
}
