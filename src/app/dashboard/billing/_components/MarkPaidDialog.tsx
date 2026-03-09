'use client';

import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import type { InvoiceDto } from '@/app/_lib/interfaces/types';

interface MarkPaidDialogProps {
    open: boolean;
    invoice: InvoiceDto | null;
    onClose: () => void;
    onConfirm: (invoiceId: string, paymentReference?: string, notes?: string) => Promise<void>;
}

const currency = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    currencyDisplay: 'symbol',
});

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
                <Stack spacing={2} sx={{ pt: 1 }}>
                    {invoice && (
                        <Stack
                            spacing={0.5}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'action.hover',
                            }}
                        >
                            <Typography variant="body2">
                                <strong>Invoice:</strong> {invoice.invoiceNumber}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Institution:</strong> {invoice.institutionName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Amount:</strong> {currency.format(invoice.totalAmountZar)}
                            </Typography>
                        </Stack>
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
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
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
            </DialogActions>
        </Dialog>
    );
}
