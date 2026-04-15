import * as React from 'react';
import AppTheme from '../../../_lib/components/shared-theme/AppTheme';

type AppThemeProps = React.ComponentProps<typeof AppTheme>;

export interface DashboardComponentProps extends Omit<
  AppThemeProps,
  'children'
> {
  children: React.ReactNode;
}
