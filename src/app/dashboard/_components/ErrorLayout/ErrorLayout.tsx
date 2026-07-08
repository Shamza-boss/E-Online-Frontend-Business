'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Button, CircularProgress, Box } from '@mui/material';
import { motion } from 'framer-motion';
import type { ErrorLayoutProps } from './interfaces';
import {
  DEFAULT_ACTION_LABEL,
  DEFAULT_ACTION_HREF,
  REDIRECT_DELAY_MS,
  REDIRECTING_LABEL,
} from './constants';
import { PageContainer, IconContainer } from './elements';

export default function ErrorLayout({
  icon,
  title,
  description,
  actionLabel = DEFAULT_ACTION_LABEL,
  actionHref = DEFAULT_ACTION_HREF,
  tone = 'error',
  children,
}: ErrorLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      router.push(actionHref as any);
    }, REDIRECT_DELAY_MS);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageContainer>
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <IconContainer $tone={tone}>
              {icon}
              <Typography variant="h3" gutterBottom>
                {title}
              </Typography>
            </IconContainer>
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
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
            >
              {loading ? REDIRECTING_LABEL : actionLabel}
            </Button>
          )}
        </Container>
      </PageContainer>
    </motion.div>
  );
}
