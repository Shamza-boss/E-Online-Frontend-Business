'use client';

import React from 'react';
import { Alert, Box, Chip, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/_lib/Enums/UserRole';

export default function SubscriptionSettingsPanel() {
    const { data, status } = useSession();
    const isLoading = status === 'loading';
    const user = data?.user;

    if (isLoading) {
        return <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />;
    }

    if (!user || user.role !== UserRole.Admin) {
        return (
            <Alert severity="info">
                Subscription details are available to institution admins only. Reach out to your administrator if you
                need access.
            </Alert>
        );
    }

    if (!user.subscription && !user.subscriptionLabel) {
        return (
            <Alert severity="warning">
                We could not find subscription data on your session. Please refresh the page or contact support.
            </Alert>
        );
    }

    const subscriptionName = user.subscriptionLabel ?? user.subscription ?? 'Subscription';
    const plan = user.subscriptionPlan ?? 'Standard';
    const creatorStatus = user.creatorEnabled ? 'Enabled' : 'Disabled';
    const institution = user.institutionName ?? 'Institution';

    const details = [
        { label: 'Subscription tier', value: user.subscription ?? 'None' },
        { label: 'Plan', value: plan },
        { label: 'Creator add-on', value: creatorStatus },
    ];

    return (
        <Paper
            sx={(theme) => ({
                borderRadius: 4,
                p: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${theme.palette.background.paper} 100%)`,
            })}
        >
            <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
                    <Box>
                        <Typography variant="subtitle2" textTransform="uppercase" color="text.secondary">
                            {institution}
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                            {subscriptionName}
                        </Typography>
                    </Box>
                    <Chip label={plan} color="primary" variant="outlined" size="small" />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
                    {details.map((detail) => (
                        <Box
                            key={detail.label}
                            sx={(theme) => ({
                                flex: 1,
                                minWidth: 200,
                                p: 2,
                                borderRadius: 3,
                                border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                            })}
                        >
                            <Typography variant="caption" textTransform="uppercase" color="text.secondary">
                                {detail.label}
                            </Typography>
                            <Typography variant="h6" fontWeight={700}>
                                {detail.value}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Stack>
        </Paper>
    );
}
