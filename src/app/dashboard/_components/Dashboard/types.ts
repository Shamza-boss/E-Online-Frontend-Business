import type * as React from 'react';
import type AppTheme from '../../../_lib/components/shared-theme/AppTheme';

type AppThemeProps = React.ComponentProps<typeof AppTheme>;

export type DashboardComponentProps = {
  children: React.ReactNode;
} & Omit<
  AppThemeProps,
  'children'
>
