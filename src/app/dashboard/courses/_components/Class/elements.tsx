import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { getDashboardPagePadding } from '@/app/_lib/layout/dashboardPageLayout';

export const ClassShell = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  minWidth: 0,
  boxSizing: 'border-box',
  ...getDashboardPagePadding(theme),
}));

export const ToolbarRow = styled(Box)(({ theme }) => ({
    flexShrink: 0,
    marginBottom: theme.spacing(1),
}));

export const ContentArea = styled(Box)({
  flex: 1,
  display: 'flex',
  overflow: 'hidden',
  minWidth: 0,
  minHeight: 0,
});

export const InnerColumn = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flexGrow: 1,
    overflow: 'hidden',
});
