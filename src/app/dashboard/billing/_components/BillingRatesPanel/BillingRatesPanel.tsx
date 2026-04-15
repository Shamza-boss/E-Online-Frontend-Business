import React, { useState } from 'react';
import {
    Alert,
    Box,
    CircularProgress,
    Stack,
    Switch,
    Typography,
} from '@mui/material';
import type { BillingRatesPanelProps } from './interfaces';
import { RoundedPaper, CenteredLoadingBox, CreatorToggleStack } from './elements';

export default function BillingRatesPanel({
    institutionName,
    creatorEnabled,
    loading,
    disabled,
    onToggleCreator,
}: BillingRatesPanelProps) {
    const [saving, setSaving] = useState(false);

    const handleToggle = async () => {
        if (disabled || saving) return;
        try {
            setSaving(true);
            await onToggleCreator(!creatorEnabled);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <RoundedPaper>
                <CenteredLoadingBox>
                    <CircularProgress />
                </CenteredLoadingBox>
            </RoundedPaper>
        );
    }

    return (
        <RoundedPaper>
            <Stack spacing={2}>
                <Box>
                    <Typography variant="h6">Creator Add-on</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Enable or disable the Creator add-on for {institutionName ?? 'the selected institution'}.
                        When enabled, an additional R20 per user is applied to the monthly invoice.
                    </Typography>
                </Box>

                <Alert severity="info" variant="outlined">
                    <Typography variant="body2">
                        <strong>Pricing tiers (per user):</strong> 0–99 users = R99 · 100–399 users = R69 · 400+ users = R49.
                        Creator add-on adds R20/user on top of the base rate.
                    </Typography>
                </Alert>

                <CreatorToggleStack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    $enabled={creatorEnabled}
                >
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                            Creator add-on
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {creatorEnabled
                                ? 'Currently enabled — R20/user is being charged'
                                : 'Currently disabled — no additional charge'}
                        </Typography>
                    </Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {saving && <CircularProgress size={20} />}
                        <Switch
                            checked={creatorEnabled}
                            onChange={handleToggle}
                            disabled={disabled || saving}
                        />
                    </Stack>
                </CreatorToggleStack>
            </Stack>
        </RoundedPaper>
    );
}
