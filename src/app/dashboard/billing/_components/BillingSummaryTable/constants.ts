import type { InvoiceStatus } from '@/app/_lib/interfaces/types';

export const CURRENCY_ZAR = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  currencyDisplay: 'symbol',
});

export const statusColors: Record<
  InvoiceStatus,
  'default' | 'primary' | 'warning' | 'success' | 'error'
> = {
  Draft: 'primary',
  Sent: 'warning',
  Paid: 'success',
  Overdue: 'error',
  Cancelled: 'default',
};
