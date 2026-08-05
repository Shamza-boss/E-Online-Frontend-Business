import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getDashboardPagePadding } from '@/app/_lib/layout/dashboardPageLayout';

export const DashboardGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  ...getDashboardPagePadding(theme),
}));

export const HeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

export const DescriptionText = styled(Typography)(({ theme }) => ({
  maxWidth: 720,
  lineHeight: 1.6,
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  },
}));

