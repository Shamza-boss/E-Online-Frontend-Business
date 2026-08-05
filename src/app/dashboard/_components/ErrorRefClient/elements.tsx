import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const ReferenceContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.action.hover,
  borderRadius: 16,
}));

export const ReferenceCode = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontWeight: 600,
  backgroundColor: theme.palette.background.paper,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));
