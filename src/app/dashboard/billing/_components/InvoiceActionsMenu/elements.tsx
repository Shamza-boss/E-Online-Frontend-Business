import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';

export const CancelMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.error.main,
}));
