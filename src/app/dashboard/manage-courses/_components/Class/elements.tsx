'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

import { getDashboardPagePadding } from '@/app/_lib/layout/dashboardPageLayout';

export const PageShell = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: 0,
    boxSizing: 'border-box',
    ...getDashboardPagePadding(theme),
}));

export const ToolbarArea = styled(Box)(({ theme }) => ({
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

export const TabHeaderBox = styled(Box)({
    borderBottom: 1,
    borderColor: 'divider',
});

export const FlexMinHeightBox = styled(Box)({
    flex: 1,
    display: 'flex',
    minHeight: 0,
    minWidth: 0,
});
