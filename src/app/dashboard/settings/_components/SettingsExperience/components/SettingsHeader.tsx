'use client';

import React from 'react';
import Typography from '@mui/material/Typography';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PageIntro from '@/app/_lib/components/PageIntro';
import type { RoleTheme } from '../types';
import { SETTINGS_DESCRIPTION, SETTINGS_TITLE } from '../constants';

type SettingsHeaderProps = {
  roleTheme: RoleTheme;
};

export default function SettingsHeader({ roleTheme }: SettingsHeaderProps) {
  return (
    <PageIntro
      title={SETTINGS_TITLE}
      titleVariant="h5"
      description={SETTINGS_DESCRIPTION}
      infoAriaLabel="About settings"
      icon={
        <SettingsOutlinedIcon color="primary" sx={{ fontSize: 32, flexShrink: 0 }} />
      }
      eyebrow={
        <Typography
          variant="overline"
          fontWeight={700}
          letterSpacing={1.5}
          sx={{ color: roleTheme.accent, display: 'block' }}
        >
          Absolute Online
        </Typography>
      }
    />
  );
}
