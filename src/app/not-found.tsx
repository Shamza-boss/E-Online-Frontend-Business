import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ErrorLayout from './dashboard/_components/ErrorLayout';

export default function NotFound() {
  return (
    <ErrorLayout
      icon={<ErrorOutlineIcon sx={{ fontSize: 80 }} />}
      title="404 – Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      tone="info"
    />
  );
}
