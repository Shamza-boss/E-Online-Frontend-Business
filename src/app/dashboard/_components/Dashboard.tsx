import * as React from 'react';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './AppNavBar';
import Header from './Header';
import SideMenu from './SideMenu';
import AppTheme from '../../_lib/components/shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';
import { SearchProvider } from '@/app/_lib/context/SearchContext';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function DashboardComponent(props: any) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          minHeight: '100vh',
          maxHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme: Theme) => ({
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            maxHeight: '100vh',
            backgroundColor: alpha(theme.palette.background.default, 1),
            overflow: 'hidden',
          })}
        >
          <SearchProvider>
            <Stack
              spacing={1}
              sx={{
                flexGrow: 1,
                alignItems: 'stretch',
                p: 1,
                mt: { xs: 8, md: 0 },
                overflow: 'hidden',
              }}
            >
              <Box sx={{ flexShrink: 0, width: '100%' }}>
                <Header />
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  width: '100%',
                  minHeight: 0,
                  overflow: 'auto',
                }}
              >
                {props.children}
              </Box>
            </Stack>
          </SearchProvider>
        </Box>
      </Box>
    </AppTheme>
  );
}
