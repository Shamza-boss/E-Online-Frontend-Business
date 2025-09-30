import { styled } from '@mui/material/styles'; // Import styled from @mui/material/styles
import { Box } from '@mui/material';

export const OutlinedWrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.action.disabledBackground}`,
  borderRadius: theme.shape.borderRadius,
}));
