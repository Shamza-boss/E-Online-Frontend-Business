import * as React from 'react';
import type { } from '@mui/x-date-pickers/themeAugmentation';
import type { } from '@mui/x-charts/themeAugmentation';
import type { } from '@mui/x-data-grid/themeAugmentation';
import type { } from '@mui/x-tree-view/themeAugmentation';
import { alpha, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AppNavbar from './AppNavBar';
import Header from './Header';
import SideMenu from './SideMenu';
import NavigationProgress from './NavigationProgress';
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

type AppThemeProps = React.ComponentProps<typeof AppTheme>;

interface DashboardComponentProps extends Omit<AppThemeProps, 'children'> {
  children: React.ReactNode;
  noticeMessage?: string | null;
  onDismissNotice?: () => void;
}

export default function DashboardComponent({
  children,
  noticeMessage,
  onDismissNotice,
  ...appThemeProps
}: DashboardComponentProps) {
  return (
    <AppTheme {...appThemeProps} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <NavigationProgress />
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
                mt: { xs: 8, md: 0 },
                overflow: 'hidden',
              }}
            >
              {noticeMessage ? (
                <Alert
                  severity="info"
                  action={
                    onDismissNotice ? (
                      <IconButton
                        aria-label="close already signed in notice"
                        color="inherit"
                        size="small"
                        onClick={onDismissNotice}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    ) : undefined
                  }
                  sx={{
                    borderRadius: 1.5,
                    boxShadow: 1,
                    mb: 0.5,
                  }}
                >
                  {noticeMessage}
                </Alert>
              ) : null}
              <Header />
              <Box
                sx={{
                  flexGrow: 1,
                  width: '100%',
                  minHeight: 0,
                  overflow: 'auto',
                }}
              >
                {children}
              </Box>
            </Stack>
          </SearchProvider>
        </Box>
      </Box>
    </AppTheme>
  );
}
