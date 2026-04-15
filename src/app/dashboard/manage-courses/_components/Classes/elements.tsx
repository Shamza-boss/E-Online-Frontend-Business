'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const ClassesGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.up('lg')]: {
        gridTemplateColumns: 'repeat(4, 1fr)',
    },
}));

export const CardWrapper = styled(Box)({
    width: '100%',
});
