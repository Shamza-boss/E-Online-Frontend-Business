import type { InvoiceDto } from '@/app/_lib/interfaces/types';

export function groupByInstitution(
  invoices: InvoiceDto[]
): Record<string, InvoiceDto[]> {
  return invoices.reduce<Record<string, InvoiceDto[]>>((acc, inv) => {
    const key = inv.institutionId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(inv);
    return acc;
  }, {});
}

export function computeTotalOutstanding(invoices: InvoiceDto[]): number {
  return invoices.reduce((s, i) => s + i.totalAmountZar, 0);
}
