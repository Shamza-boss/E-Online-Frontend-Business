import type { ReactNode } from 'react';
import type { TypographyProps } from '@mui/material/Typography';

export type PageIntroCollapseBreakpoint = 'sm' | 'md';

export type PageIntroProps = {
  /** Primary page heading. Hidden below `collapseBelow`; shown in the info popover. */
  title?: ReactNode;
  /** Optional overline above the title (e.g. brand). */
  eyebrow?: ReactNode;
  /** Supporting copy. Hidden below `collapseBelow`; shown in the info popover. */
  description?: ReactNode;
  /** Leading icon next to the title. */
  icon?: ReactNode;
  /** Always-visible actions (refresh, publish, enroll, etc.). */
  actions?: ReactNode;
  /** Extra reference content (legends, chips). Collapsed with title/description on small screens. */
  children?: ReactNode;
  titleVariant?: Extract<TypographyProps['variant'], 'h4' | 'h5' | 'h6'>;
  /** Hide title/description/children at this breakpoint and below. Default `md`. */
  collapseBelow?: PageIntroCollapseBreakpoint;
  infoAriaLabel?: string;
};
