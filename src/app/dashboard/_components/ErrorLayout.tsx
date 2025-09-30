'use client';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface ErrorLayoutProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  tone?: 'error' | 'warning' | 'info' | 'success';
  children?: ReactNode; // ✅ new optional children prop
}

export default function ErrorLayout({
  icon,
  title,
  description,
  actionLabel = 'Return to Dashboard',
  actionHref = '/dashboard',
  tone = 'error',
  children,
}: ErrorLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      router.push(actionHref!);
    }, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: `${tone}.main`,
                mb: 2,
              }}
            >
              {icon}
              <Typography variant="h3" gutterBottom>
                {title}
              </Typography>
            </Box>
          </motion.div>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {description}
          </Typography>

          {children && <Box mt={2}>{children}</Box>}

          {actionHref && (
            <Button
              variant="contained"
              color={tone}
              onClick={handleClick}
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading ? 'Redirecting...' : actionLabel}
            </Button>
          )}
        </Container>
      </Box>
    </motion.div>
  );
}
