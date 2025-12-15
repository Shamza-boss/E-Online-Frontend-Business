import { Stack, Typography, Chip } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ErrorLayout from '@/app/dashboard/_components/ErrorLayout';

export default function ForbiddenPage() {
  return (
    <ErrorLayout
      icon={<LockOutlinedIcon sx={{ fontSize: 80 }} />}
      title="Access Denied"
      description="You don't have permission to view this page. This might be because your role doesn't include access to this feature."
      actionLabel="Go to Dashboard"
      actionHref="/dashboard"
      tone="warning"
    >
      <Stack spacing={2} alignItems="center">
        <Chip
          label="ERR_1002"
          size="small"
          variant="outlined"
          sx={{ fontFamily: 'monospace' }}
        />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ maxWidth: 400, textAlign: 'center' }}
        >
          If you believe you should have access, please contact your
          administrator.
        </Typography>
      </Stack>
    </ErrorLayout>
  );
}
