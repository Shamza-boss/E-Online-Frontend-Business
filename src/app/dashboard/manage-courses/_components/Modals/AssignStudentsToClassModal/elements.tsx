'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

export const ToolbarActions = styled(Box)({
    display: 'flex',
    gap: 8,
    alignItems: 'center',
});

export const ModalContent = styled(Box)(({ theme }) => ({
    paddingInline: theme.spacing(3),
    paddingBlock: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
        paddingInline: theme.spacing(2),
        paddingBlock: theme.spacing(2),
    },
}));
