import type { ReactNode } from 'react';

export type RoleHomeHero = {
  label: string;
  value: string;
  hint?: string;
  onOpen?: () => void;
};

export type RoleHomeShellProps = {
  title: string;
  description?: string;
  heroes?: RoleHomeHero[];
  /** Desktop grid columns for the bento (default 3). */
  columns?: 2 | 3;
  children: ReactNode;
};
