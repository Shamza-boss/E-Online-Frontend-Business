import { Box, Tooltip, Typography } from '@mui/material';
import type { GridCellTextProps } from './types';

export function GridCellText({ children, title }: GridCellTextProps) {
  const content = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Typography variant="body2" noWrap component="span" sx={{ maxWidth: '100%' }}>
        {children}
      </Typography>
    </Box>
  );

  if (!title) return content;

  return <Tooltip title={title}>{content}</Tooltip>;
}
