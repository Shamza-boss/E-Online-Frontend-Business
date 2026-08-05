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
import SendIcon from '@mui/icons-material/Send';
import type { SendInvoiceDialogProps } from './types';
import { CURRENCY_ZAR } from './constants';
import { ContentStack, InvoiceSummaryStack, StyledDialogActions } from './elements';

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
                <ContentStack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                        This will generate a PDF invoice and email it to the recipient below.
                    </Typography>
                    {invoice && (
                        <InvoiceSummaryStack spacing={0.5}>
                            <Typography variant="body2">
                                <strong>Invoice:</strong> {invoice.invoiceNumber}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Institution:</strong> {invoice.institutionName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Total:</strong> {CURRENCY_ZAR.format(invoice.totalAmountZar)}
                            </Typography>
                        </InvoiceSummaryStack>
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
                </ContentStack>
            </DialogContent>
            <StyledDialogActions>
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
            </StyledDialogActions>
        </Dialog>
    );
}
