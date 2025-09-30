import ErrorLayout from '@/app/dashboard/_components/ErrorLayout';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function ForbiddenPage() {
  return (
    <ErrorLayout
      icon={<LockOutlinedIcon sx={{ fontSize: 80 }} />}
      title="403 – Forbidden"
      description="You don’t have permission to access this page."
      tone="warning"
    />
  );
}
