import type { ReactNode } from 'react';

export type ErrorTone = 'error' | 'warning' | 'info' | 'success';

export type ErrorLayoutProps = {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  tone?: ErrorTone;
  children?: ReactNode;
}
