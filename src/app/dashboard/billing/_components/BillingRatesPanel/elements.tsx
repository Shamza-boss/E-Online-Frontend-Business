import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export const RoundedPaper = styled(Paper)(({ theme }) => ({
    borderRadius: Number(theme.shape.borderRadius) * 3,
    padding: theme.spacing(3),
}));

export const CenteredLoadingBox = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
}));

interface CreatorToggleStackProps {
    $enabled: boolean;
}

export const CreatorToggleStack = styled(Stack, {
    shouldForwardProp: (prop) => prop !== '$enabled',
})<CreatorToggleStackProps>(({ theme, $enabled }) => ({
    padding: theme.spacing(2),
    borderRadius: Number(theme.shape.borderRadius) * 2,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: $enabled
        ? theme.palette.success.main + '10'
        : theme.palette.action.hover,
}));
