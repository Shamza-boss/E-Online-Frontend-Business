'use client';

import React, { useState } from 'react';
import {
    Button,
    CircularProgress,
    Collapse,
    Stack,
    Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BlockIcon from '@mui/icons-material/Block';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useOverdueInvoices } from '@/app/_lib/hooks/useInvoices';
import { enforcePayment } from '@/app/_lib/actions/invoices';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { CURRENCY_ZAR } from './constants';
import { groupByInstitution, computeTotalOutstanding } from './utils';
import {
    BannerAlert,
    BoldAlertTitle,
    DetailContainer,
    InstitutionBox,
    InvoiceCaption,
} from './elements';

export default function OverdueInvoicesBanner() {
    const { data: overdueInvoices, isLoading, mutate } = useOverdueInvoices();
    const { showAlert } = useAlert();
    const [enforcing, setEnforcing] = useState(false);
    const [expanded, setExpanded] = useState(false);

    if (isLoading || !overdueInvoices || overdueInvoices.length === 0) return null;

    const byInstitution = groupByInstitution(overdueInvoices);
    const institutionCount = Object.keys(byInstitution).length;
    const totalOutstanding = computeTotalOutstanding(overdueInvoices);

    const handleEnforce = async () => {
        try {
            setEnforcing(true);
            const disabledIds = await enforcePayment();
            await mutate();
            if (disabledIds.length > 0) {
                showAlert('warning', `${disabledIds.length} institution(s) disabled for non-payment.`);
            } else {
                showAlert('info', 'No institutions were past the 30-day threshold yet.');
            }
        } catch {
            showAlert('error', 'Failed to enforce payment. Please try again.');
        } finally {
            setEnforcing(false);
        }
    };

    return (
        <BannerAlert
            severity="error"
            variant="outlined"
            icon={<WarningAmberIcon />}
        >
            <BoldAlertTitle>
                {overdueInvoices.length} Overdue Invoice{overdueInvoices.length > 1 ? 's' : ''} · {institutionCount} Institution{institutionCount > 1 ? 's' : ''}
            </BoldAlertTitle>

            <Stack spacing={1}>
                <Typography variant="body2">
                    Total outstanding: <strong>{CURRENCY_ZAR.format(totalOutstanding)}</strong>. Institutions
                    with invoices overdue for more than 30 days will be automatically disabled.
                </Typography>

                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={enforcing ? <CircularProgress size={16} color="inherit" /> : <BlockIcon />}
                        onClick={handleEnforce}
                        disabled={enforcing}
                    >
                        Enforce Payment
                    </Button>
                    <Button
                        size="small"
                        variant="text"
                        onClick={() => setExpanded((prev) => !prev)}
                        endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    >
                        {expanded ? 'Hide' : 'Show'} Details
                    </Button>
                </Stack>

                <Collapse in={expanded}>
                    <DetailContainer>
                        {Object.entries(byInstitution).map(([id, invoices]) => (
                            <InstitutionBox key={id}>
                                <Typography variant="body2" fontWeight={600}>
                                    {invoices[0].institutionName}
                                </Typography>
                                {invoices.map((inv) => (
                                    <InvoiceCaption key={inv.id} variant="caption" color="text.secondary" pl={2}>
                                        {inv.invoiceNumber} · {CURRENCY_ZAR.format(inv.totalAmountZar)} · Due {new Date(inv.dueDate).toLocaleDateString('en-ZA')}
                                    </InvoiceCaption>
                                ))}
                            </InstitutionBox>
                        ))}
                    </DetailContainer>
                </Collapse>
            </Stack>
        </BannerAlert>
    );
}
