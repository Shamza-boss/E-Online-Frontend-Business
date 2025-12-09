import React from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControlLabel,
    MenuItem,
    Paper,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { BillingRateDto, SubscriptionFeatureFlag, SubscriptionPlan } from '@/app/_lib/interfaces/types';
import { featureFlagToPlan, planToFeatureFlag } from '@/app/_lib/utils/subscriptions';

interface BillingRatesPanelProps {
    institutionName?: string;
    rate?: BillingRateDto | null;
    loading?: boolean;
    error?: Error;
    disabled?: boolean;
    onSave: (updated: BillingRateDto) => Promise<void>;
}

const DEFAULT_RATE: BillingRateDto = {
    plan: SubscriptionFeatureFlag.Standard,
    baseMonthlyPrice: 0,
    enterpriseBaseUsers: 1500,
    enterpriseOveragePricePerUser: 0,
    creatorAddonMonthlyPrice: 0,
    creatorEnabled: false,
};

const planOptions: SubscriptionPlan[] = ['Standard', 'Enterprise'];

const asNumber = (value: string): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

export default function BillingRatesPanel({
    institutionName,
    rate,
    loading,
    error,
    disabled,
    onSave,
}: BillingRatesPanelProps) {
    const [draft, setDraft] = React.useState<BillingRateDto>(rate ?? DEFAULT_RATE);
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        setDraft(rate ?? DEFAULT_RATE);
    }, [rate]);

    const handleNumberChange = (field: keyof BillingRateDto) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const next = asNumber(event.target.value);
            setDraft((prev) => ({ ...prev, [field]: next }));
        };

    const handlePlanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as SubscriptionPlan;
        setDraft((prev) => ({ ...prev, plan: planToFeatureFlag(value) }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (disabled || saving) return;
        try {
            setSaving(true);
            await onSave(draft);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => setDraft(rate ?? DEFAULT_RATE);

    if (error) {
        return (
            <Alert severity="error">
                Unable to load the current rate for {institutionName ?? 'this institution'}. Try selecting a different
                institution or refreshing the page.
            </Alert>
        );
    }

    const showLoader = loading && !rate;

    return (
        <Paper component="form" onSubmit={handleSubmit} sx={{ borderRadius: 3, p: 3 }}>
            <Stack spacing={2}>
                <Box>
                    <Typography variant="h6">Subscription & Pricing</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Adjust the plan and billing rates for {institutionName ?? 'the selected institution'}. Changes only
                        impact future invoices.
                    </Typography>
                </Box>

                {showLoader ? (
                    <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        <TextField
                            select
                            label="Plan"
                            value={featureFlagToPlan(draft.plan)}
                            onChange={handlePlanChange}
                            disabled={disabled}
                        >
                            {planOptions.map((plan) => (
                                <MenuItem key={plan} value={plan}>
                                    {plan}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Base monthly price"
                            type="number"
                            value={draft.baseMonthlyPrice}
                            onChange={handleNumberChange('baseMonthlyPrice')}
                            inputProps={{ min: 0, step: 1 }}
                            disabled={disabled}
                        />

                        {featureFlagToPlan(draft.plan) === 'Enterprise' && (
                            <>
                                <TextField
                                    label="Included users"
                                    type="number"
                                    value={draft.enterpriseBaseUsers}
                                    onChange={handleNumberChange('enterpriseBaseUsers')}
                                    inputProps={{ min: 0, step: 1 }}
                                    helperText="Users covered before overage fees apply"
                                    disabled={disabled}
                                />
                                <TextField
                                    label="Overage price per user"
                                    type="number"
                                    value={draft.enterpriseOveragePricePerUser}
                                    onChange={handleNumberChange('enterpriseOveragePricePerUser')}
                                    inputProps={{ min: 0, step: 0.5 }}
                                    helperText="Applied to each user above the included threshold"
                                    disabled={disabled}
                                />
                            </>
                        )}

                        <TextField
                            label="Creator add-on monthly price"
                            type="number"
                            value={draft.creatorAddonMonthlyPrice}
                            onChange={handleNumberChange('creatorAddonMonthlyPrice')}
                            inputProps={{ min: 0, step: 1 }}
                            disabled={disabled}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={draft.creatorEnabled}
                                    onChange={(_, checked) => setDraft((prev) => ({ ...prev, creatorEnabled: checked }))}
                                    disabled={disabled}
                                />
                            }
                            label="Creator add-on included"
                        />

                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button onClick={handleReset} disabled={disabled || saving} variant="outlined">
                                Reset
                            </Button>
                            <Button type="submit" variant="contained" disabled={disabled || saving}>
                                {saving ? 'Saving...' : 'Save changes'}
                            </Button>
                        </Stack>
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
}
