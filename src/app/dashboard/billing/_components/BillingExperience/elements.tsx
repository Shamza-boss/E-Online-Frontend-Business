import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export const CenteredLoadingBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
}));

export const AccessDeniedAlert = styled(Alert)(({ theme }) => ({
    margin: theme.spacing(3),
}));

import { getDashboardPagePadding } from '@/app/_lib/layout/dashboardPageLayout';

export const PageStack = styled(Stack)(({ theme }) => ({
  minWidth: 0,
  width: '100%',
  boxSizing: 'border-box',
  ...getDashboardPagePadding(theme),
}));

export const FlexBox = styled(Box)({
    flex: 1,
});

export const BoldChip = styled(Chip)({
    fontWeight: 600,
});
