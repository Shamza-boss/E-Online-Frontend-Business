'use client';

import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import type { MarkPaidDialogProps } from './interfaces';
import { CURRENCY_ZAR } from './constants';
import { ContentStack, InvoiceSummaryStack, StyledDialogActions } from './elements';

export default function MarkPaidDialog({
    open,
    invoice,
    onClose,
    onConfirm,
}: MarkPaidDialogProps) {
    const [paymentReference, setPaymentReference] = useState('');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const handleConfirm = async () => {
        if (!invoice) return;
        try {
            setSaving(true);
            await onConfirm(
                invoice.id,
                paymentReference || undefined,
                notes || undefined,
            );
            setPaymentReference('');
            setNotes('');
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogContent>
                <ContentStack spacing={2}>
                    {invoice && (
                        <InvoiceSummaryStack spacing={0.5}>
                            <Typography variant="body2">
                                <strong>Invoice:</strong> {invoice.invoiceNumber}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Institution:</strong> {invoice.institutionName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Amount:</strong> {CURRENCY_ZAR.format(invoice.totalAmountZar)}
                            </Typography>
                        </InvoiceSummaryStack>
                    )}
                    <TextField
                        label="Payment Reference"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="e.g. EFT-123"
                        helperText="Optional — e.g. bank reference or transaction ID."
                        fullWidth
                    />
                    <TextField
                        label="Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Paid via FNB"
                        multiline
                        rows={2}
                        fullWidth
                    />
                </ContentStack>
            </DialogContent>
            <StyledDialogActions>
                <Button onClick={onClose} disabled={saving}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<PaidIcon />}
                    onClick={handleConfirm}
                    disabled={saving}
                >
                    {saving ? 'Recording…' : 'Confirm Payment'}
                </Button>
            </StyledDialogActions>
        </Dialog>
    );
}
