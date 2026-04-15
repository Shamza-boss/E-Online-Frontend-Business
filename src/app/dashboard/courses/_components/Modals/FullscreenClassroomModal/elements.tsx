import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';

export const ContentArea = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    minHeight: 0,
    backgroundColor: theme.palette.background.default,
}));

export const FlexOutlinedWrapper = styled(OutlinedWrapper)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
});

export const FlexOutlinedWrapperMinHeight = styled(OutlinedWrapper)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
    overflow: 'hidden',
});

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

export const ToolbarSpacer = styled(Box)({
    flex: 1,
});
