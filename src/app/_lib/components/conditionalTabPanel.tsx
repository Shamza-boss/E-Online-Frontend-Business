import { Box } from '@mui/material';

interface ConditionalTabPanelProps {
  value: string;
  index: string;
  children: React.ReactNode;
  sx?: any;
}

function ConditionalTabPanel({
  value,
  index,
  children,
  sx,
}: ConditionalTabPanelProps) {
  if (value !== index) return null;

  return (
    <Box
      role="tabpanel"
      hidden={false}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
export default ConditionalTabPanel;
