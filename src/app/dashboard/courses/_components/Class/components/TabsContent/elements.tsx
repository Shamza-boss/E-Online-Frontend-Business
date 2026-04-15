import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const FlexColumnBox = styled(Box)({
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
});

export const TabHeaderBox = styled(Box)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
}));
