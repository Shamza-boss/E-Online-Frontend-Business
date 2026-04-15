import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const FlexColumnContainer = styled(Box)({
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
});

export const FlexColumnHiddenContainer = styled(Box)({
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});

export const CenteredOverlayBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexDirection: 'column',
    gap: 16,
});

export const TabContentBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
}));

export const TabHeaderBox = styled(Box)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
}));
