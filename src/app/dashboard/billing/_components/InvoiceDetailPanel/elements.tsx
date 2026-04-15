import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const StyledDialogTitle = styled(DialogTitle)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});

export const LoadingBox = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    display: 'flex',
    justifyContent: 'center',
}));

export const StatusChip = styled(Chip)({
    alignSelf: 'flex-start',
    fontWeight: 600,
});

export const DetailsGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gap: theme.spacing(2),
    gridTemplateColumns: 'repeat(2, 1fr)',
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(4, 1fr)',
    },
}));

export const RateTierBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: Number(theme.shape.borderRadius) * 2,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}));

export const TierCaption = styled(Typography)({
    display: 'block',
    marginTop: 4,
    opacity: 0.85,
}) as typeof Typography;

export const TotalsStack = styled(Stack)(({ theme }) => ({
    paddingRight: theme.spacing(2),
}));

export const NarrowDivider = styled(Divider)({
    width: 200,
});
