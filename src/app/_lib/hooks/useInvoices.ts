import useSWR from 'swr';
import {
  getInstitutionInvoices,
  getInvoiceDetail,
  getOverdueInvoices,
  getInvoiceSummary,
  getInvoiceStatusSummaries,
} from '../actions/invoices';
import type {
  InvoiceDto,
  InvoiceSummaryDto,
  InvoiceStatusSummaryDto,
} from '../interfaces/types';

export function useInstitutionInvoices(institutionId?: string) {
  return useSWR<InvoiceDto[]>(
    institutionId ? ['institution-invoices', institutionId] : null,
    () => getInstitutionInvoices(institutionId as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: Number.POSITIVE_INFINITY,
      keepPreviousData: true,
    },
  );
}

export function useInvoiceDetail(invoiceId?: string) {
  return useSWR<InvoiceDto>(
    invoiceId ? ['invoice-detail', invoiceId] : null,
    () => getInvoiceDetail(invoiceId as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: Number.POSITIVE_INFINITY,
    },
  );
}

export function useOverdueInvoices() {
  return useSWR<InvoiceDto[]>(
    'invoices-overdue',
    getOverdueInvoices,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
}

export function useInvoiceSummary(year?: number, month?: number) {
  return useSWR<InvoiceSummaryDto>(
    ['invoice-summary', year, month],
    () => getInvoiceSummary(year, month),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
}

export function useInvoiceStatusSummaries() {
  return useSWR<InvoiceStatusSummaryDto[]>(
    'invoice-status-summaries',
    getInvoiceStatusSummaries,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
}
