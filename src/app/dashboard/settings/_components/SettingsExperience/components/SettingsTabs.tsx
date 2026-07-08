'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { TAB_ITEMS } from '../constants';

interface SettingsTabsProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SettingsTabs({ value, onChange }: SettingsTabsProps) {
  const handleChange = React.useCallback(
    (_: React.SyntheticEvent, next: string) => {
      onChange(next);
    },
    [onChange],
  );

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      sx={{
        flexShrink: 0,
        width: '100%',
        minHeight: 48,
        borderBottom: 1,
        borderColor: 'divider',
        '& .MuiTabs-flexContainer': {
          gap: { xs: 0.5, sm: 1 },
        },
        '& .MuiTab-root': {
          alignItems: 'flex-start',
          textAlign: 'left',
          minHeight: { xs: 48, sm: 72 },
          py: 1.25,
          px: { xs: 1.5, sm: 2 },
          minWidth: { xs: 120, sm: 160 },
          maxWidth: { xs: 180, sm: 240 },
          textTransform: 'none',
        },
      }}
    >
      {TAB_ITEMS.map((item) => (
        <Tab
          key={item.value}
          value={item.value}
          label={
            <Box sx={{ minWidth: 0, width: '100%' }}>
              <Typography fontWeight={700} noWrap sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {item.label}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: { xs: 'none', sm: '-webkit-box' },
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.3,
                  mt: 0.25,
                }}
              >
                {item.helper}
              </Typography>
            </Box>
          }
        />
      ))}
    </Tabs>
  );
}
