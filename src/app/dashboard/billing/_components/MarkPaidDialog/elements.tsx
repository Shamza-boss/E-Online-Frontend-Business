import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import DialogActions from '@mui/material/DialogActions';

export const ContentStack = styled(Stack)(({ theme }) => ({
    paddingTop: theme.spacing(1),
}));

export const InvoiceSummaryStack = styled(Stack)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: Number(theme.shape.borderRadius) * 2,
    backgroundColor: theme.palette.action.hover,
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
    padding: theme.spacing(2),
}));
