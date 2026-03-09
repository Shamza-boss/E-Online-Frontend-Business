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
import SendIcon from '@mui/icons-material/Send';
import type { InvoiceDto } from '@/app/_lib/interfaces/types';

interface SendInvoiceDialogProps {
    open: boolean;
    invoice: InvoiceDto | null;
    defaultEmail?: string;
    onClose: () => void;
    onSend: (invoiceId: string, recipientEmail?: string) => Promise<void>;
}

const currency = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    currencyDisplay: 'symbol',
});

export default function SendInvoiceDialog({
    open,
    invoice,
    defaultEmail,
    onClose,
    onSend,
}: SendInvoiceDialogProps) {
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);

    const effectiveEmail = email || defaultEmail || '';

    const handleSend = async () => {
        if (!invoice) return;
        try {
            setSending(true);
            await onSend(invoice.id, effectiveEmail || undefined);
            onClose();
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Send Invoice</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        This will generate a PDF invoice and email it to the recipient below.
                    </Typography>
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
                                <strong>Total:</strong> {currency.format(invoice.totalAmountZar)}
                            </Typography>
                        </Stack>
                    )}
                    <TextField
                        label="Recipient Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={defaultEmail || 'admin@institution.co.za'}
                        helperText="Leave blank to use the institution admin's email."
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={sending}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={handleSend}
                    disabled={sending}
                >
                    {sending ? 'Sending…' : 'Send Invoice'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
