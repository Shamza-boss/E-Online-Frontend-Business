import { format } from 'date-fns';
import type { InvoiceDto } from '@/app/_lib/interfaces/types';
import { CURRENCY_ZAR } from './constants';

export const formatBillingMonth = (invoice: InvoiceDto) => {
  const date = new Date(invoice.year, invoice.month - 1, 1);
  return format(date, 'MMM yyyy');
};

export const formatCurrency = (value?: number) =>
  CURRENCY_ZAR.format(value ?? 0);
