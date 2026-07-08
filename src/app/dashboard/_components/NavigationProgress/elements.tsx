import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { PROGRESS_Z_INDEX } from './constants';

export const ProgressContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: PROGRESS_Z_INDEX,
});
