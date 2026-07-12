'use client';

import React from 'react';
import { Alert, Box, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useSWR from 'swr';
import { getRoleChipConfig } from '@/app/_lib/common/functions';
import { getMySettings } from '@/app/_lib/actions';
import type { SettingsResponseDto } from '@/app/_lib/interfaces/types';
import { formatRoleLabel } from '../profile/ProfileSettingsCard';
import LegalPanel from '../legal/LegalPanel';
import {
  SettingsBody,
  SettingsPageRoot,
  TabContentArea,
} from './elements';
import {
  buildRoleTheme,
  extractRoleValue,
  resolveUserRole,
} from './utils';
import type { RoleKey } from './types';
import SettingsHeader from './components/SettingsHeader';
import SettingsTabs from './components/SettingsTabs';
import ProfilePanel from './components/ProfilePanel';
import InsightsPanel from './components/InsightsPanel';
import RoleGuidancePanel from './components/RoleGuidancePanel';
import RocketBackdrop from './components/RocketBackdrop';
import SettingsPageSkeleton from '@/app/dashboard/_components/_skeletonLoaders/SettingsPageSkeleton';
import { dashboardSectionSpacing } from '@/app/_lib/layout/dashboardPageLayout';

export type SettingsExperienceProps = {
  initialSettings: SettingsResponseDto;
}

export default function SettingsExperience({ initialSettings }: SettingsExperienceProps) {
  const { data, error, isLoading } = useSWR<SettingsResponseDto>(
    'my-settings',
    getMySettings,
    { fallbackData: initialSettings, revalidateOnMount: false },
  );

  if (isLoading && !data) {
    return <SettingsPageSkeleton />;
  }

  if (error || !data) {
    return (
      <SettingsPageRoot>
        <Alert severity="error">
          Failed to load settings. The server might be unavailable. Please try again later.
        </Alert>
      </SettingsPageRoot>
    );
  }

  return <SettingsExperienceContent data={data} />;
}

function SettingsExperienceContent({ data }: { data: SettingsResponseDto }) {
  const theme = useTheme();
  const { user, stats } = data;
  const roleValue = extractRoleValue(user.role);
  const resolvedUserRole = resolveUserRole(user.role);
  const roleLabel =
    resolvedUserRole !== null
      ? getRoleChipConfig(resolvedUserRole).label
      : roleValue
        ? formatRoleLabel(roleValue)
        : 'Member';
  const roleKey: RoleKey = resolvedUserRole ?? 'default';
  const roleTheme = React.useMemo(
    () => buildRoleTheme(roleKey, theme),
    [roleKey, theme],
  );

  const [tab, setTab] = React.useState('profile');

  return (
    <SettingsPageRoot>
      <RocketBackdrop />
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <SettingsHeader roleTheme={roleTheme} />
        <SettingsTabs value={tab} onChange={setTab} />

        <SettingsBody>
          <TabContentArea>
            <Stack spacing={dashboardSectionSpacing} sx={{ width: '100%', minWidth: 0 }}>
              {tab === 'profile' ? (
                <ProfilePanel
                  user={{
                    userId: user.userId,
                    email: user.email ?? '',
                    firstName: user.firstName ?? '',
                    lastName: user.lastName ?? '',
                    role: roleLabel,
                    institutionName: user.institutionName ?? null,
                  }}
                />
              ) : null}
              {tab === 'insights' && (
                <InsightsPanel
                  stats={stats}
                  roleTheme={roleTheme}
                  roleLabel={roleLabel}
                />
              )}
              {tab === 'guidance' && (
                <RoleGuidancePanel activeRole={resolvedUserRole} />
              )}
              {tab === 'legal' && <LegalPanel />}
            </Stack>
          </TabContentArea>
        </SettingsBody>
      </Box>
    </SettingsPageRoot>
  );
}
