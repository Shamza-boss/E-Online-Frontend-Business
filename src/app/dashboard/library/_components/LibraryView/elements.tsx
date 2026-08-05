import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { getDashboardPagePadding } from '@/app/_lib/layout/dashboardPageLayout';

export const LibraryRoot = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  ...getDashboardPagePadding(theme),
}));

export const LibraryHeaderSection = styled(Box)({
  flexShrink: 0,
});

export const LibraryContentSection = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  minHeight: 0,
});

export const LibraryCardsScrollArea = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: theme.spacing(2),
  // Keep last cards clear of the scrollbar and pagination separator
  paddingBottom: theme.spacing(3),
}));

export const LibraryPaginationBar = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  marginTop: 0,
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));
