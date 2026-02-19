import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    Switch,
    Typography,
} from '@mui/material';

interface BillingRatesPanelProps {
    institutionName?: string;
    creatorEnabled: boolean;
    loading?: boolean;
    disabled?: boolean;
    onToggleCreator: (enabled: boolean) => Promise<void>;
}

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
            <Paper sx={{ borderRadius: 3, p: 3 }}>
                <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            </Paper>
        );
    }

    return (
        <Paper sx={{ borderRadius: 3, p: 3 }}>
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

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        backgroundColor: (theme) =>
                            creatorEnabled
                                ? theme.palette.success.main + '10'
                                : theme.palette.action.hover,
                    }}
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
                            color="success"
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    );
}
