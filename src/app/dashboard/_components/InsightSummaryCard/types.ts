import type { ReactNode } from 'react';

export type InsightSummaryCardProps = {
  title: string;
  /** Prominent summary figure shown above the chart. */
  value?: string | number;
  /** Short label under the value (e.g. "active 30d"). */
  valueHint?: string;
  subtitle?: string;
  onOpen: () => void;
  children: ReactNode;
};
