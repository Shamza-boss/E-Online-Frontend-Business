import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

export const RoundedPaper = styled(Paper)(({ theme }) => ({
    borderRadius: Number(theme.shape.borderRadius) * 3,
    padding: theme.spacing(3),
}));

export const CenteredLoadingStack = styled(Stack)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

type MetricHighlightBoxProps = {
    $variant: 'success' | 'info' | 'primary';
}

export const MetricHighlightBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$variant',
})<MetricHighlightBoxProps>(({ theme, $variant }) => ({
    flex: 1,
    border: `1px dashed ${theme.palette[$variant].light}`,
    borderRadius: Number(theme.shape.borderRadius) * 2,
    padding: theme.spacing(2),
}));

export const DashboardCostBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: Number(theme.shape.borderRadius) * 2,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.action.hover,
}));

export const FlexBox = styled(Box)({
    flex: 1,
});

export const SpacedRow = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
});

export const ResponsiveGrid4 = styled(Box)(({ theme }) => ({
    display: 'grid',
    gap: theme.spacing(2),
    gridTemplateColumns: 'repeat(2, 1fr)',
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(4, 1fr)',
    },
}));
