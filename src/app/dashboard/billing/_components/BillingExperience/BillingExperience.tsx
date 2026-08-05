'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { Button, CircularProgress } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
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
import BillingToolbar from '../BillingToolbar';
import PageIntro from '@/app/_lib/components/PageIntro';
import {
  getAllInstitutions,
  deactivateInstitution,
  activateInstitution,
} from '@/app/_lib/actions/institutions';
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
  BILLING_DESCRIPTION,
  BILLING_INFO_ARIA,
  BILLING_TITLE,
  CreditCardIcon,
  SECTION_INVOICES,
  SECTION_OVERVIEW,
  SECTION_PROJECTION,
  SECTION_RATES,
} from './constants';
import {
  CenteredLoadingBox,
  AccessDeniedAlert,
  BillingRoot,
  BillingHeaderSection,
  BillingScrollArea,
  BillingSectionsStack,
  BillingSection,
  BillingSectionHeader,
  BillingSectionTitle,
  BillingSectionDescription,
} from './elements';

function BillingSectionBlock({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <BillingSection>
      <BillingSectionHeader>
        <BillingSectionTitle variant="h6">{title}</BillingSectionTitle>
        <BillingSectionDescription variant="body2" color="text.secondary">
          {description}
        </BillingSectionDescription>
      </BillingSectionHeader>
      {children}
    </BillingSection>
  );
}

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

  const handleToggleCreator = async (creatorEnabled: boolean) => {
    if (!selectedInstitutionId) return;
    try {
      await setCreatorAddon(selectedInstitutionId, { creatorEnabled });
      showAlert(
        'success',
        creatorEnabled ? 'Creator add-on enabled.' : 'Creator add-on disabled.',
      );
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
      showAlert(
        'success',
        `${created.length} invoice(s) generated for all active institutions.`,
      );
      await invoices.mutate();
    } catch {
      showAlert('error', 'Failed to generate invoices. Please try again.');
    } finally {
      setGeneratingAll(false);
    }
  };

  const handleSend = useCallback(
    async (invoiceId: string, recipientEmail?: string) => {
      await sendInvoiceAction(
        invoiceId,
        recipientEmail ? { recipientEmail } : undefined,
      );
      showAlert('success', 'Invoice sent successfully.');
      await invoices.mutate();
    },
    [invoices, showAlert],
  );

  const handleMarkPaid = useCallback(
    async (invoiceId: string, paymentReference?: string, notes?: string) => {
      await markPaidAction(invoiceId, { paymentReference, notes });
      showAlert('success', 'Payment recorded.');
      await invoices.mutate();
    },
    [invoices, showAlert],
  );

  const handleDownloadPdf = useCallback(
    async (invoice: InvoiceDto) => {
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
    },
    [showAlert],
  );

  const handleCancel = useCallback(
    async (invoice: InvoiceDto) => {
      try {
        await cancelInvoiceAction(invoice.id);
        showAlert('info', `Invoice ${invoice.invoiceNumber} cancelled.`);
        await invoices.mutate();
      } catch {
        showAlert('error', 'Failed to cancel invoice.');
      }
    },
    [invoices, showAlert],
  );

  const handleUnpay = useCallback(
    async (invoice: InvoiceDto) => {
      try {
        await unpayInvoiceAction(invoice.id);
        showAlert('info', `Payment for ${invoice.invoiceNumber} has been reversed.`);
        await invoices.mutate();
      } catch {
        showAlert('error', 'Failed to reverse payment.');
      }
    },
    [invoices, showAlert],
  );

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
        Billing controls are reserved for Platform Owners. Please switch accounts if you
        need elevated access.
      </AccessDeniedAlert>
    );
  }

  return (
    <>
      <BillingRoot>
        <BillingHeaderSection>
          <PageIntro
            title={BILLING_TITLE}
            description={BILLING_DESCRIPTION}
            icon={<CreditCardIcon color="primary" />}
            infoAriaLabel={BILLING_INFO_ARIA}
            actions={
              <Button
                variant="outlined"
                size="small"
                startIcon={
                  generatingAll ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <ReceiptLongIcon />
                  )
                }
                onClick={() => void handleGenerateAll()}
                disabled={generatingAll}
              >
                Generate all invoices
              </Button>
            }
          />

          <OverdueInvoicesBanner />

          <BillingToolbar
            institutionOptions={institutionOptions}
            selectedInstitutionId={selectedInstitutionId}
            selectedOption={selectedOption}
            institutionsLoading={institutionsLoading}
            institutionsError={Boolean(institutionsError)}
            generating={generating}
            togglingStatus={togglingStatus}
            onSelectInstitution={setSelectedInstitutionId}
            onToggleInstitutionStatus={() => void handleToggleInstitutionStatus()}
            onGenerateInvoice={() => void handleGenerate()}
          />
        </BillingHeaderSection>

        <BillingScrollArea>
          <BillingSectionsStack>
            <BillingSectionBlock
              title={SECTION_OVERVIEW.title}
              description={SECTION_OVERVIEW.description}
            >
              <BillingOverviewCard
                summary={summary.data}
                billingDashboard={billingDashboard.data}
                loading={
                  summary.isLoading ||
                  summary.isValidating ||
                  billingDashboard.isLoading
                }
                institutionName={selectedOption?.name}
              />
            </BillingSectionBlock>

            <BillingSectionBlock
              title={SECTION_RATES.title}
              description={SECTION_RATES.description}
            >
              <BillingRatesPanel
                institutionName={selectedOption?.name}
                creatorEnabled={summary.data?.creatorEnabled ?? false}
                loading={summary.isLoading || summary.isValidating}
                disabled={!selectedInstitutionId}
                onToggleCreator={handleToggleCreator}
              />
            </BillingSectionBlock>

            <BillingSectionBlock
              title={SECTION_PROJECTION.title}
              description={SECTION_PROJECTION.description}
            >
              <BillingProjectionPanel
                projection={projection.data}
                billingDashboard={billingDashboard.data}
                loading={projection.isLoading || projection.isValidating}
                error={projection.error as Error | undefined}
                onRefresh={() => projection.mutate()}
              />
            </BillingSectionBlock>

            <BillingSectionBlock
              title={SECTION_INVOICES.title}
              description={SECTION_INVOICES.description}
            >
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
            </BillingSectionBlock>
          </BillingSectionsStack>
        </BillingScrollArea>
      </BillingRoot>

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
