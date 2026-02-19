"use client";

import React, { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import {
    Alert,
    Box,
    CircularProgress,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import {
    useInstitutionBilling,
    useInstitutionBillingHistory,
    useInstitutionProjection,
} from '@/app/_lib/hooks/useSubscriptions';
import { useInstitutionBillingDashboard } from '@/app/_lib/hooks/useDashboard';
import BillingRatesPanel from './BillingRatesPanel';
import BillingSummaryTable from './BillingSummaryTable';
import BillingOverviewCard from './BillingOverviewCard';
import { getAllInstitutions } from '@/app/_lib/actions/institutions';
import { InstitutionWithAdminDto, BillingRateDto } from '@/app/_lib/interfaces/types';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { setCreatorAddon } from '@/app/_lib/actions/subscriptions';
import BillingProjectionPanel from './BillingProjectionPanel';

interface InstitutionOption {
    id: string;
    name: string;
}

export default function BillingExperience() {
    const { data: session, status } = useSession();
    const rawRole = session?.user?.role;
    const normalizedRole =
        typeof rawRole === 'string' ? (parseInt(rawRole, 10) as UserRole) : (rawRole as UserRole | undefined);
    const isPlatformOwner = normalizedRole === UserRole.PlatformAdmin;
    const { showAlert } = useAlert();

    const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null);

    const {
        data: institutionEntries,
        isLoading: institutionsLoading,
        error: institutionsError,
    } = useSWR<InstitutionWithAdminDto[]>(
        isPlatformOwner ? 'billing-institutions' : null,
        getAllInstitutions,
    );

    const institutionOptions = useMemo<InstitutionOption[]>(() => {
        if (!institutionEntries) return [];
        return institutionEntries
            .filter((entry) => entry.institution?.id && entry.institution?.name)
            .map((entry) => ({
                id: entry.institution!.id,
                name: entry.institution!.name,
            }));
    }, [institutionEntries]);

    useEffect(() => {
        if (!selectedInstitutionId && institutionOptions.length > 0) {
            setSelectedInstitutionId(institutionOptions[0].id);
        }
    }, [institutionOptions, selectedInstitutionId]);

    const selectedInstitutionName = useMemo(() => {
        return institutionOptions.find((option) => option.id === selectedInstitutionId)?.name;
    }, [institutionOptions, selectedInstitutionId]);

    const summary = useInstitutionBilling(selectedInstitutionId ?? undefined);
    const history = useInstitutionBillingHistory(selectedInstitutionId ?? undefined);
    const projection = useInstitutionProjection(selectedInstitutionId ?? undefined);
    const billingDashboard = useInstitutionBillingDashboard(selectedInstitutionId ?? undefined);

    const handleToggleCreator = async (creatorEnabled: boolean) => {
        if (!selectedInstitutionId) return;
        try {
            await setCreatorAddon(selectedInstitutionId, { creatorEnabled });
            showAlert('success', creatorEnabled ? 'Creator add-on enabled.' : 'Creator add-on disabled.');
            await summary.mutate();
            await billingDashboard.mutate();
        } catch (error) {
            console.error('Failed to toggle creator add-on', error);
            showAlert('error', 'Unable to update creator add-on. Please try again.');
        }
    };

    if (status === 'loading') {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isPlatformOwner) {
        return (
            <Alert severity="warning" sx={{ m: 3 }}>
                Billing controls are reserved for Platform Owners. Please switch accounts if you need elevated
                access.
            </Alert>
        );
    }

    return (
        <Stack spacing={3} sx={{ p: 3 }}>
            <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Billing & Subscriptions
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Choose an institution to inspect its billing, view costs, projections, and toggle the creator add-on.
                </Typography>
            </Box>

            <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                    Institution
                </Typography>
                {institutionsError ? (
                    <Alert severity="error">
                        We could not load the institution directory. Please refresh the page.
                    </Alert>
                ) : (
                    <TextField
                        select
                        value={selectedInstitutionId ?? ''}
                        onChange={(event) => setSelectedInstitutionId(event.target.value)}
                        disabled={institutionsLoading || institutionOptions.length === 0}
                        helperText={institutionOptions.length === 0 ? 'No institutions available yet.' : undefined}
                    >
                        {institutionOptions.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
            </Stack>

            <BillingOverviewCard
                summary={summary.data}
                billingDashboard={billingDashboard.data}
                loading={summary.isLoading || summary.isValidating || billingDashboard.isLoading}
                institutionName={selectedInstitutionName}
            />

            <BillingRatesPanel
                institutionName={selectedInstitutionName}
                creatorEnabled={summary.data?.creatorEnabled ?? false}
                loading={summary.isLoading || summary.isValidating}
                disabled={!selectedInstitutionId}
                onToggleCreator={handleToggleCreator}
            />

            <BillingProjectionPanel
                projection={projection.data}
                billingDashboard={billingDashboard.data}
                loading={projection.isLoading || projection.isValidating}
                error={projection.error as Error | undefined}
                onRefresh={() => projection.mutate()}
            />

            <BillingSummaryTable
                institutionName={selectedInstitutionName}
                history={history.data}
                loading={history.isLoading || history.isValidating}
                error={history.error as Error | undefined}
                onRefresh={() => history.mutate()}
            />
        </Stack>
    );
}
