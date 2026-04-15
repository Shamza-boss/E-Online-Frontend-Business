import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';

export const TablePaper = styled(Paper)(({ theme }) => ({
    borderRadius: Number(theme.shape.borderRadius) * 3,
    padding: theme.spacing(2),
}));

export const HeaderStack = styled(Stack)(({ theme }) => ({
    paddingBottom: theme.spacing(2),
}));

export const CenteredLoadingBox = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    display: 'flex',
    justifyContent: 'center',
}));

export const EmptyStateBox = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

export const ClickableRow = styled(TableRow)({
    cursor: 'pointer',
});

export const StatusChip = styled(Chip)({
    fontWeight: 600,
    minWidth: 72,
});
