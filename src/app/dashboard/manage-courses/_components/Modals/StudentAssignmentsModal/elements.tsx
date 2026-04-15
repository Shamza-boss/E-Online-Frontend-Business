'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const LoadingContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    paddingBlock: theme.spacing(4),
}));
