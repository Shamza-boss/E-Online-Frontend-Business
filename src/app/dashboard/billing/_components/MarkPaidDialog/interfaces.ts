import type { InvoiceDto } from '@/app/_lib/interfaces/types';

export interface MarkPaidDialogProps {
  open: boolean;
  invoice: InvoiceDto | null;
  onClose: () => void;
  onConfirm: (
    invoiceId: string,
    paymentReference?: string,
    notes?: string
  ) => Promise<void>;
}
