'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const NoRowsContainer = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
}));
