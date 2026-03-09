'use server';

import type {
  InvoiceDto,
  InvoiceSummaryDto,
  InvoiceStatusSummaryDto,
  SendInvoiceDto,
  MarkInvoicePaidDto,
} from '../interfaces/types';
import { serverFetch } from '../serverFetch';

const INVOICE_BASE = '/invoices';

function invoicePath(suffix: string = '') {
  return `${INVOICE_BASE}${suffix}`;
}

function buildQuery(params?: Record<string, string | number | undefined>): string {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

// ── Generation ───────────────────────────────────────────────────

export async function generateInvoice(
  institutionId: string,
  year?: number,
  month?: number,
): Promise<InvoiceDto> {
  const qs = buildQuery({ year, month });
  return serverFetch<InvoiceDto>(
    invoicePath(`/${encodeURIComponent(institutionId)}/generate${qs}`),
    { method: 'POST' },
  );
}

export async function generateAllInvoices(
  year?: number,
  month?: number,
): Promise<InvoiceDto[]> {
  const qs = buildQuery({ year, month });
  return serverFetch<InvoiceDto[]>(
    invoicePath(`/generate-all${qs}`),
    { method: 'POST' },
  );
}

// ── Retrieval ────────────────────────────────────────────────────

export async function getInstitutionInvoices(
  institutionId: string,
): Promise<InvoiceDto[]> {
  return serverFetch<InvoiceDto[]>(
    invoicePath(`/${encodeURIComponent(institutionId)}`),
    { method: 'GET' },
  );
}

export async function getAllInvoices(
  year?: number,
  month?: number,
): Promise<InvoiceDto[]> {
  const qs = buildQuery({ year, month });
  return serverFetch<InvoiceDto[]>(
    invoicePath(`/all${qs}`),
    { method: 'GET' },
  );
}

export async function getInvoiceDetail(
  invoiceId: string,
): Promise<InvoiceDto> {
  return serverFetch<InvoiceDto>(
    invoicePath(`/detail/${encodeURIComponent(invoiceId)}`),
    { method: 'GET' },
  );
}

export async function getOverdueInvoices(): Promise<InvoiceDto[]> {
  return serverFetch<InvoiceDto[]>(
    invoicePath('/overdue'),
    { method: 'GET' },
  );
}

export async function getInvoiceSummary(
  year?: number,
  month?: number,
): Promise<InvoiceSummaryDto> {
  const qs = buildQuery({ year, month });
  return serverFetch<InvoiceSummaryDto>(
    invoicePath(`/summary${qs}`),
    { method: 'GET' },
  );
}

export async function getInvoiceStatusSummaries(): Promise<InvoiceStatusSummaryDto[]> {
  return serverFetch<InvoiceStatusSummaryDto[]>(
    invoicePath('/status-summaries'),
    { method: 'GET' },
  );
}

// ── Actions ──────────────────────────────────────────────────────

export async function sendInvoice(
  invoiceId: string,
  payload?: SendInvoiceDto,
): Promise<InvoiceDto> {
  return serverFetch<InvoiceDto>(
    invoicePath(`/${encodeURIComponent(invoiceId)}/send`),
    { method: 'POST', body: payload },
  );
}

export async function markInvoicePaid(
  invoiceId: string,
  payload?: MarkInvoicePaidDto,
): Promise<InvoiceDto> {
  return serverFetch<InvoiceDto>(
    invoicePath(`/${encodeURIComponent(invoiceId)}/pay`),
    { method: 'PATCH', body: payload },
  );
}

export async function unpayInvoice(
  invoiceId: string,
): Promise<InvoiceDto> {
  return serverFetch<InvoiceDto>(
    invoicePath(`/${encodeURIComponent(invoiceId)}/unpay`),
    { method: 'PATCH' },
  );
}

export async function cancelInvoice(
  invoiceId: string,
): Promise<InvoiceDto> {
  return serverFetch<InvoiceDto>(
    invoicePath(`/${encodeURIComponent(invoiceId)}/cancel`),
    { method: 'PATCH' },
  );
}

// ── Enforcement ──────────────────────────────────────────────────

export async function markOverdue(): Promise<void> {
  await serverFetch<void>(invoicePath('/mark-overdue'), { method: 'POST' });
}

export async function enforcePayment(): Promise<string[]> {
  return serverFetch<string[]>(invoicePath('/enforce-payment'), { method: 'POST' });
}
