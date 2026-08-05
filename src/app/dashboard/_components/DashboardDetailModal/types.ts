import type { ReactNode } from 'react';

export type DashboardDetailModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  children?: ReactNode;
};
