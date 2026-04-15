import type { InvoiceStatus } from '@/app/_lib/interfaces/types';

export const canSend = (s: InvoiceStatus) => s === 'Draft' || s === 'Sent';
export const canPay = (s: InvoiceStatus) => s === 'Sent' || s === 'Overdue';
export const canCancel = (s: InvoiceStatus) =>
  s !== 'Paid' && s !== 'Cancelled';
export const canUnpay = (s: InvoiceStatus) => s === 'Paid';
