import { styled } from '@mui/material/styles';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';

export const FlexOutlinedWrapper = styled(OutlinedWrapper)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
    overflow: 'hidden',
});
