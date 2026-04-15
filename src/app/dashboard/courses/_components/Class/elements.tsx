import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const ClassShell = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: theme.spacing(3),
}));

export const ToolbarRow = styled(Box)(({ theme }) => ({
    flexShrink: 0,
    marginBottom: theme.spacing(1),
}));

export const ContentArea = styled(Box)({
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
});

export const InnerColumn = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flexGrow: 1,
    overflow: 'hidden',
});
