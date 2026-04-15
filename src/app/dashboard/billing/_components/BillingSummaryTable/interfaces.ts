import type { InvoiceDto } from '@/app/_lib/interfaces/types';

export interface BillingSummaryTableProps {
  invoices?: InvoiceDto[];
  loading?: boolean;
  error?: Error;
  onRefresh?: () => void;
  institutionName?: string;
  onSend: (invoice: InvoiceDto) => void;
  onMarkPaid: (invoice: InvoiceDto) => void;
  onDownloadPdf: (invoice: InvoiceDto) => Promise<void>;
  onCancel: (invoice: InvoiceDto) => Promise<void>;
  onUnpay: (invoice: InvoiceDto) => Promise<void>;
  onViewDetail: (invoice: InvoiceDto) => void;
}
