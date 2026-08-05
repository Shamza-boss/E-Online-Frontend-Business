import React from 'react';
import { Box, Typography } from '@mui/material';
import { StatCardPaper, StatIconCircle } from '../../elements';

export type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'primary' | 'info' | 'success' | 'warning';
}

export default function StatCard({
  icon,
  label,
  value,
  color,
}: Readonly<StatCardProps>) {
  return (
    <StatCardPaper variant="outlined" $color={color}>
      <StatIconCircle $color={color}>{icon}</StatIconCircle>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          textTransform="uppercase"
          fontWeight={600}
          sx={{ letterSpacing: '0.04em', fontSize: '0.7rem' }}
        >
          {label}
        </Typography>
        <Typography
          variant="body1"
          fontWeight={700}
          noWrap
          sx={{ lineHeight: 1.3, fontSize: { xs: '0.95rem', sm: '1rem' } }}
        >
          {value}
        </Typography>
      </Box>
    </StatCardPaper>
  );
}
