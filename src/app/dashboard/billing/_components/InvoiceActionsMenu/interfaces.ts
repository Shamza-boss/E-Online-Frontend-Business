import type { InvoiceDto } from '@/app/_lib/interfaces/types';

export interface InvoiceActionsMenuProps {
  invoice: InvoiceDto;
  onSend: (invoice: InvoiceDto) => void;
  onMarkPaid: (invoice: InvoiceDto) => void;
  onDownloadPdf: (invoice: InvoiceDto) => Promise<void>;
  onCancel: (invoice: InvoiceDto) => Promise<void>;
  onUnpay: (invoice: InvoiceDto) => Promise<void>;
  onViewDetail: (invoice: InvoiceDto) => void;
}
