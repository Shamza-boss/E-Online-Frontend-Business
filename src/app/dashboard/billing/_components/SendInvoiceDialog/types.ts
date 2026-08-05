import type { InvoiceDto } from '@/app/_lib/interfaces/types';

export type SendInvoiceDialogProps = {
  open: boolean;
  invoice: InvoiceDto | null;
  defaultEmail?: string;
  onClose: () => void;
  onSend: (invoiceId: string, recipientEmail?: string) => Promise<void>;
}
