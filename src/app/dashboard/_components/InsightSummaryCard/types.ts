import type { ReactNode } from 'react';

export type InsightSummaryCardProps = {
  title: string;
  /** Prominent summary figure shown above the chart. */
  value?: string | number;
  /** Short label under the value (e.g. "active 30d"). */
  valueHint?: string;
  subtitle?: string;
  /** When omitted, the card is display-only (no expand affordance). */
  onOpen?: () => void;
  /** Extra context on hover (especially useful for non-expandable cards). */
  hoverTooltip?: ReactNode;
  /** Color for the value figure (defaults to primary). */
  valueColor?: 'primary.main' | 'success.main' | 'warning.main' | 'error.main';
  children: ReactNode;
};
