'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import {
  SettingsBody,
  SettingsHeaderBox,
  SettingsPageRoot,
  TabContentArea,
} from '@/app/dashboard/settings/_components/SettingsExperience/elements';
import { TAB_ITEMS } from '@/app/dashboard/settings/_components/SettingsExperience/constants';

export default function SettingsPageSkeleton() {
  return (
    <SettingsPageRoot>
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <SettingsHeaderBox>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Skeleton variant="circular" width={32} height={32} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton variant="text" width={140} height={18} />
                <Skeleton variant="text" width={240} height={32} sx={{ mt: 0.5 }} />
              </Box>
            </Stack>
            <Skeleton variant="text" width="90%" height={20} sx={{ maxWidth: 720 }} />
          </Stack>
        </SettingsHeaderBox>

        <Stack direction="row" spacing={2} sx={{ borderBottom: 1, borderColor: 'divider', pb: 0.5, mb: 0 }}>
          {TAB_ITEMS.map((tab) => (
            <Stack key={tab.value} spacing={0.5} sx={{ minWidth: 120, py: 1 }}>
              <Skeleton variant="text" width={110} height={24} />
              <Skeleton variant="text" width={140} height={16} sx={{ display: { xs: 'none', sm: 'block' } }} />
            </Stack>
          ))}
        </Stack>

        <SettingsBody>
          <TabContentArea>
            <Stack spacing={2}>
              <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Skeleton variant="circular" width={72} height={72} sx={{ flexShrink: 0 }} />
                  <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                    <Skeleton variant="text" width={180} height={28} />
                    <Skeleton variant="text" width="85%" height={20} />
                  </Stack>
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                <Stack spacing={2}>
                  <Skeleton variant="text" width={200} height={28} />
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <Skeleton variant="rounded" height={88} sx={{ flex: 1 }} />
                    <Skeleton variant="rounded" height={88} sx={{ flex: 1 }} />
                    <Skeleton variant="rounded" height={88} sx={{ flex: 1 }} />
                  </Stack>
                  <Skeleton variant="rounded" height={56} />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Skeleton variant="rounded" height={56} sx={{ flex: 1 }} />
                    <Skeleton variant="rounded" height={56} sx={{ flex: 1 }} />
                  </Stack>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Skeleton variant="rounded" width={80} height={36} />
                    <Skeleton variant="rounded" width={120} height={36} />
                  </Stack>
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
                <Stack spacing={1.5}>
                  <Skeleton variant="rounded" height={48} />
                  <Skeleton variant="rounded" height={48} />
                </Stack>
              </Paper>
            </Stack>
          </TabContentArea>
        </SettingsBody>
      </Box>
    </SettingsPageRoot>
  );
}
