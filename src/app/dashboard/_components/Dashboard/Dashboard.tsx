import * as React from 'react';
import type { } from '@mui/x-date-pickers/themeAugmentation';
import type { } from '@mui/x-charts/themeAugmentation';
import type { } from '@mui/x-data-grid/themeAugmentation';
import type { } from '@mui/x-tree-view/themeAugmentation';
import CssBaseline from '@mui/material/CssBaseline';
import AppNavbar from '../AppNavBar';
import Header from '../Header';
import SideMenu from '../SideMenu';
import NavigationProgress from '../NavigationProgress';
import AppTheme from '../../../_lib/components/shared-theme/AppTheme';
import { SearchProvider } from '@/app/_lib/context/SearchContext';
import type { DashboardComponentProps } from './types';
import { xThemeComponents } from './constants';
import {
  RootContainer,
  MainArea,
  ContentStack,
  ChildrenContainer,
} from './elements';

export default function DashboardComponent({
  children,
  ...appThemeProps
}: DashboardComponentProps) {
  return (
    <AppTheme {...appThemeProps} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <NavigationProgress />
      <RootContainer>
        <SideMenu />
        <AppNavbar />
        <MainArea>
          <SearchProvider>
            <ContentStack>
              <Header />
              <ChildrenContainer>{children}</ChildrenContainer>
            </ContentStack>
          </SearchProvider>
        </MainArea>
      </RootContainer>
    </AppTheme>
  );
}
