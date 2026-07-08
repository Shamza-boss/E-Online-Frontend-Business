'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import type { RoleTheme } from '../types';
import { SETTINGS_DESCRIPTION, SETTINGS_TITLE } from '../constants';
import { SettingsDescription, SettingsHeaderBox } from '../elements';

interface SettingsHeaderProps {
  roleTheme: RoleTheme;
}

export default function SettingsHeader({ roleTheme }: SettingsHeaderProps) {
  return (
    <SettingsHeaderBox>
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
            <SettingsOutlinedIcon color="primary" sx={{ fontSize: 32, flexShrink: 0 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="overline"
                fontWeight={700}
                letterSpacing={1.5}
                sx={{ color: roleTheme.accent, display: 'block' }}
              >
                Absolute Online
              </Typography>
              <Typography variant="h5" fontWeight={600} lineHeight={1.3}>
                {SETTINGS_TITLE}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <SettingsDescription variant="body2" color="text.secondary">
          {SETTINGS_DESCRIPTION}
        </SettingsDescription>
      </Stack>
    </SettingsHeaderBox>
  );
}
