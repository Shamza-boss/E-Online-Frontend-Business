import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export const RoundedPaper = styled(Paper)(({ theme }) => ({
    borderRadius: Number(theme.shape.borderRadius) * 3,
    padding: theme.spacing(3),
}));

export const CenteredLoadingStack = styled(Stack)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

export const ResponsiveGrid4 = styled(Box)(({ theme }) => ({
    display: 'grid',
    gap: theme.spacing(2),
    gridTemplateColumns: 'repeat(2, 1fr)',
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(4, 1fr)',
    },
}));

export const ResponsiveGrid5 = styled(Box)(({ theme }) => ({
    display: 'grid',
    gap: theme.spacing(2),
    gridTemplateColumns: 'repeat(2, 1fr)',
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(5, 1fr)',
    },
}));
