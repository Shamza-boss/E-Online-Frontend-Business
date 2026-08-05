import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getDashboardPagePadding } from '@/app/_lib/layout/dashboardPageLayout';

export const CenteredLoadingBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  justifyContent: 'center',
  height: '100%',
  alignItems: 'center',
}));

export const AccessDeniedAlert = styled(Alert)(({ theme }) => ({
  margin: theme.spacing(3),
}));

/** Library-style full-height page shell. */
export const BillingRoot = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  ...getDashboardPagePadding(theme),
}));

export const BillingHeaderSection = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1.5),
  },
}));

export const BillingScrollArea = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  paddingTop: theme.spacing(2),
  paddingRight: theme.spacing(0.5),
  paddingBottom: theme.spacing(3),
}));

export const BillingSectionsStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  minWidth: 0,
  gap: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2.5),
  },
}));

export const BillingSection = styled(Box)({
  width: '100%',
  minWidth: 0,
});

export const BillingSectionHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

export const BillingSectionTitle = styled(Typography)({
  fontWeight: 700,
}) as typeof Typography;

export const BillingSectionDescription = styled(Typography)({
  // color via color="text.secondary" at call site
}) as typeof Typography;

/** @deprecated Prefer BillingRoot — kept if anything still imports PageStack */
export const PageStack = styled(Stack)(({ theme }) => ({
  minWidth: 0,
  width: '100%',
  boxSizing: 'border-box',
  ...getDashboardPagePadding(theme),
}));

export const FlexBox = styled(Box)({
  flex: 1,
  minWidth: 0,
});

export const BoldChip = styled(Chip)({
  fontWeight: 600,
});
