'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const TabContentBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    height: '100%',
    maxHeight: '100%',
    overflow: 'auto',
}));
