'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const PageShell = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: theme.spacing(3),
}));

export const ToolbarArea = styled(Box)(({ theme }) => ({
    flexShrink: 0,
    marginBottom: theme.spacing(1),
}));

export const ContentArea = styled(Box)({
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
});

export const TabHeaderBox = styled(Box)({
    borderBottom: 1,
    borderColor: 'divider',
});

export const FlexMinHeightBox = styled(Box)({
    flex: 1,
    display: 'flex',
    minHeight: 0,
});
