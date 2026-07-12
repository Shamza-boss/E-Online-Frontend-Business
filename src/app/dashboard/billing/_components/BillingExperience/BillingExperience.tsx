"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import {
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Stack,
    TextField,
    Typography,
    Alert,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import {
    useInstitutionBilling,
    useInstitutionProjection,
} from '@/app/_lib/hooks/useSubscriptions';
import { useInstitutionBillingDashboard } from '@/app/_lib/hooks/useDashboard';
import { useInstitutionInvoices } from '@/app/_lib/hooks/useInvoices';
import BillingRatesPanel from '../BillingRatesPanel';
import BillingSummaryTable from '../BillingSummaryTable';
import BillingOverviewCard from '../BillingOverviewCard';
import BillingProjectionPanel from '../BillingProjectionPanel';
import OverdueInvoicesBanner from '../OverdueInvoicesBanner';
import SendInvoiceDialog from '../SendInvoiceDialog';
import MarkPaidDialog from '../MarkPaidDialog';
import InvoiceDetailPanel from '../InvoiceDetailPanel';
import PageIntro from '@/app/_lib/components/PageIntro';
import { getAllInstitutions, deactivateInstitution, activateInstitution } from '@/app/_lib/actions/institutions';
import {
    generateInvoice,
    generateAllInvoices,
    sendInvoice as sendInvoiceAction,
    markInvoicePaid as markPaidAction,
    cancelInvoice as cancelInvoiceAction,
    unpayInvoice as unpayInvoiceAction,
} from '@/app/_lib/actions/invoices';
import type { InstitutionWithAdminDto, InvoiceDto } from '@/app/_lib/interfaces/types';
import type { BillingExperienceProps } from './types';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { setCreatorAddon } from '@/app/_lib/actions/subscriptions';
import { normalizeRole, buildInstitutionOptions } from './utils';
import {
    CenteredLoadingBox,
    AccessDeniedAlert,
    PageStack,
    FlexBox,
    BoldChip,
} from './elements';

export default function BillingExperience({
    initialInstitutions,
    initialInstitutionId,
    initialBillingDashboard,
}: BillingExperienceProps = {}) {
    const { data: session, status } = useSession();
    const rawRole = session?.user?.role;
    const normalizedRole = normalizeRole(rawRole);
    const isPlatformOwner = normalizedRole === UserRole.PlatformAdmin;
    const { showAlert } = useAlert();

    const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(
        initialInstitutionId ?? null,
    );

    // Dialog state
    const [sendDialogInvoice, setSendDialogInvoice] = useState<InvoiceDto | null>(null);
    const [payDialogInvoice, setPayDialogInvoice] = useState<InvoiceDto | null>(null);
    const [detailInvoice, setDetailInvoice] = useState<InvoiceDto | null>(null);
    const [generating, setGenerating] = useState(false);
    const [generatingAll, setGeneratingAll] = useState(false);
    const [togglingStatus, setTogglingStatus] = useState(false);

    const {
        data: institutionEntries,
        isLoading: institutionsLoading,
        error: institutionsError,
        mutate: mutateInstitutions,
    } = useSWR<InstitutionWithAdminDto[]>(
        isPlatformOwner ? 'billing-institutions' : null,
        getAllInstitutions,
        {
            fallbackData: initialInstitutions,
            revalidateOnMount: !initialInstitutions,
            revalidateOnFocus: false,
        },
    );

    const institutionOptions = useMemo(
        () => buildInstitutionOptions(institutionEntries),
        [institutionEntries],
    );

    useEffect(() => {
        if (!selectedInstitutionId && institutionOptions.length > 0) {
            const first = institutionOptions[0];
            if (first) {
                setSelectedInstitutionId(first.id);
            }
        }
    }, [institutionOptions, selectedInstitutionId]);

    const selectedOption = useMemo(() => {
        return institutionOptions.find((o) => o.id === selectedInstitutionId);
    }, [institutionOptions, selectedInstitutionId]);

    const summary = useInstitutionBilling(selectedInstitutionId ?? undefined);
    const invoices = useInstitutionInvoices(selectedInstitutionId ?? undefined);
    const projection = useInstitutionProjection(selectedInstitutionId ?? undefined);
    const billingDashboard = useInstitutionBillingDashboard(
        selectedInstitutionId ?? undefined,
        selectedInstitutionId === initialInstitutionId
            ? initialBillingDashboard
            : undefined,
    );

    // ── Handlers ──────────────────────────────────────────────────

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

    const handleGenerate = async () => {
        if (!selectedInstitutionId) return;
        try {
            setGenerating(true);
            const inv = await generateInvoice(selectedInstitutionId);
            showAlert('success', `Invoice ${inv.invoiceNumber} generated.`);
            await invoices.mutate();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            if (msg.includes('409')) {
                showAlert('warning', 'An invoice already exists for this month.');
            } else {
                showAlert('error', 'Failed to generate invoice. Please try again.');
            }
        } finally {
            setGenerating(false);
        }
    };

    const handleGenerateAll = async () => {
        try {
            setGeneratingAll(true);
            const created = await generateAllInvoices();
            showAlert('success', `${created.length} invoice(s) generated for all active institutions.`);
            await invoices.mutate();
        } catch {
            showAlert('error', 'Failed to generate invoices. Please try again.');
        } finally {
            setGeneratingAll(false);
        }
    };

    const handleSend = useCallback(async (invoiceId: string, recipientEmail?: string) => {
        await sendInvoiceAction(invoiceId, recipientEmail ? { recipientEmail } : undefined);
        showAlert('success', 'Invoice sent successfully.');
        await invoices.mutate();
    }, [invoices, showAlert]);

    const handleMarkPaid = useCallback(async (invoiceId: string, paymentReference?: string, notes?: string) => {
        await markPaidAction(invoiceId, { paymentReference, notes });
        showAlert('success', 'Payment recorded.');
        await invoices.mutate();
    }, [invoices, showAlert]);

    const handleDownloadPdf = useCallback(async (invoice: InvoiceDto) => {
        try {
            const res = await fetch(`/api/proxy/invoices/detail/${invoice.id}/pdf`);
            if (!res.ok) throw new Error('Failed to download PDF');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${invoice.invoiceNumber}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            showAlert('error', 'Failed to download PDF. Please try again.');
        }
    }, [showAlert]);

    const handleCancel = useCallback(async (invoice: InvoiceDto) => {
        try {
            await cancelInvoiceAction(invoice.id);
            showAlert('info', `Invoice ${invoice.invoiceNumber} cancelled.`);
            await invoices.mutate();
        } catch {
            showAlert('error', 'Failed to cancel invoice.');
        }
    }, [invoices, showAlert]);

    const handleUnpay = useCallback(async (invoice: InvoiceDto) => {
        try {
            await unpayInvoiceAction(invoice.id);
            showAlert('info', `Payment for ${invoice.invoiceNumber} has been reversed.`);
            await invoices.mutate();
        } catch {
            showAlert('error', 'Failed to reverse payment.');
        }
    }, [invoices, showAlert]);

    const handleToggleInstitutionStatus = async () => {
        if (!selectedInstitutionId || !selectedOption) return;
        try {
            setTogglingStatus(true);
            if (selectedOption.isActive) {
                await deactivateInstitution(selectedInstitutionId);
                showAlert('warning', `${selectedOption.name} has been disabled.`);
            } else {
                await activateInstitution(selectedInstitutionId);
                showAlert('success', `${selectedOption.name} has been re-enabled.`);
            }
            await mutateInstitutions();
        } catch {
            showAlert('error', 'Failed to update institution status.');
        } finally {
            setTogglingStatus(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────

    if (status === 'loading') {
        return (
            <CenteredLoadingBox>
                <CircularProgress />
            </CenteredLoadingBox>
        );
    }

    if (!isPlatformOwner) {
        return (
            <AccessDeniedAlert severity="warning">
                Billing controls are reserved for Platform Owners. Please switch accounts if you need elevated
                access.
            </AccessDeniedAlert>
        );
    }

    return (
        <>
            <PageStack spacing={3}>
                <PageIntro
                    title="Billing & Invoicing"
                    description="Generate invoices, track payments, manage institution billing status, and enforce payment policies."
                    infoAriaLabel="About billing"
                />

                {/* Overdue banner */}
                <OverdueInvoicesBanner />

                {/* Institution selector + controls */}
                <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-end' }}>
                        <FlexBox>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Institution
                            </Typography>
                            {institutionsError ? (
                                <Alert severity="error">
                                    We could not load the institution directory. Please refresh the page.
                                </Alert>
                            ) : (
                                <TextField
                                    select
                                    fullWidth
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
                        </FlexBox>

                        {selectedOption && (
                            <Stack direction="row" spacing={1} alignItems="center" pb={institutionOptions.length === 0 ? 0 : '23px'}>
                                <BoldChip
                                    label={selectedOption.isActive ? 'Active' : 'Disabled'}
                                    color={selectedOption.isActive ? 'success' : 'error'}
                                    variant="filled"
                                    size="small"
                                />
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color={selectedOption.isActive ? 'error' : 'success'}
                                    startIcon={togglingStatus
                                        ? <CircularProgress size={16} color="inherit" />
                                        : selectedOption.isActive ? <BlockIcon /> : <CheckCircleIcon />
                                    }
                                    disabled={togglingStatus}
                                    onClick={handleToggleInstitutionStatus}
                                >
                                    {selectedOption.isActive ? 'Disable' : 'Enable'}
                                </Button>
                            </Stack>
                        )}
                    </Stack>

                    {/* Invoice generation buttons */}
                    {selectedInstitutionId && (
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="contained"
                                startIcon={generating ? <CircularProgress size={18} color="inherit" /> : <ReceiptIcon />}
                                onClick={handleGenerate}
                                disabled={generating}
                            >
                                Generate Invoice
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={generatingAll ? <CircularProgress size={18} color="inherit" /> : <ReceiptLongIcon />}
                                onClick={handleGenerateAll}
                                disabled={generatingAll}
                            >
                                Generate All Invoices
                            </Button>
                        </Stack>
                    )}
                </Stack>

                <BillingOverviewCard
                    summary={summary.data}
                    billingDashboard={billingDashboard.data}
                    loading={summary.isLoading || summary.isValidating || billingDashboard.isLoading}
                    institutionName={selectedOption?.name}
                />

                <BillingRatesPanel
                    institutionName={selectedOption?.name}
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
                    institutionName={selectedOption?.name}
                    invoices={invoices.data}
                    loading={invoices.isLoading || invoices.isValidating}
                    error={invoices.error as Error | undefined}
                    onRefresh={() => invoices.mutate()}
                    onSend={(inv) => setSendDialogInvoice(inv)}
                    onMarkPaid={(inv) => setPayDialogInvoice(inv)}
                    onDownloadPdf={handleDownloadPdf}
                    onCancel={handleCancel}
                    onUnpay={handleUnpay}
                    onViewDetail={(inv) => setDetailInvoice(inv)}
                />
            </PageStack>

            {/* Dialogs */}
            <SendInvoiceDialog
                open={!!sendDialogInvoice}
                invoice={sendDialogInvoice}
                defaultEmail={selectedOption?.adminEmail ?? undefined}
                onClose={() => setSendDialogInvoice(null)}
                onSend={handleSend}
            />

            <MarkPaidDialog
                open={!!payDialogInvoice}
                invoice={payDialogInvoice}
                onClose={() => setPayDialogInvoice(null)}
                onConfirm={handleMarkPaid}
            />

            <InvoiceDetailPanel
                open={!!detailInvoice}
                invoice={detailInvoice}
                onClose={() => setDetailInvoice(null)}
            />
        </>
    );
}
