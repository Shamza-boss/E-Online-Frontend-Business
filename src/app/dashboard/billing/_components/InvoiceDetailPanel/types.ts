import type { InvoiceDto } from '@/app/_lib/interfaces/types';

export type InvoiceDetailPanelProps = {
  open: boolean;
  invoice: InvoiceDto | null;
  loading?: boolean;
  onClose: () => void;
}
