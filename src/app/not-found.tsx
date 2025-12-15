import { Stack, Typography, Chip } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ErrorLayout from './dashboard/_components/ErrorLayout';

export default function NotFound() {
  return (
    <ErrorLayout
      icon={<SearchOffIcon sx={{ fontSize: 80 }} />}
      title="Page Not Found"
      description="The page you're looking for doesn't exist or may have been moved to a different location."
      actionLabel="Go to Dashboard"
      actionHref="/dashboard"
      tone="info"
    >
      <Stack spacing={2} alignItems="center">
        <Chip
          label="ERR_2001"
          size="small"
          variant="outlined"
          sx={{ fontFamily: 'monospace' }}
        />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ maxWidth: 400, textAlign: 'center' }}
        >
          Check the URL for typos or use the navigation to find what you need.
        </Typography>
      </Stack>
    </ErrorLayout>
  );
}
