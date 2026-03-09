'use client';

import React from 'react';
import {
    Box,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import type { InvoiceDto, InvoiceStatus } from '@/app/_lib/interfaces/types';

interface InvoiceDetailPanelProps {
    open: boolean;
    invoice: InvoiceDto | null;
    loading?: boolean;
    onClose: () => void;
}

const currency = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    currencyDisplay: 'symbol',
});

const statusColors: Record<InvoiceStatus, 'default' | 'primary' | 'warning' | 'success' | 'error'> = {
    Draft: 'primary',
    Sent: 'warning',
    Paid: 'success',
    Overdue: 'error',
    Cancelled: 'default',
};

function formatDate(iso: string | null) {
    if (!iso) return '—';
    return format(new Date(iso), 'dd MMM yyyy, HH:mm');
}

function formatBillingPeriod(year: number, month: number) {
    return format(new Date(year, month - 1, 1), 'MMMM yyyy');
}

export default function InvoiceDetailPanel({
    open,
    invoice,
    loading,
    onClose,
}: InvoiceDetailPanelProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Invoice Details</span>
                <IconButton onClick={onClose} size="small" aria-label="Close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {loading || !invoice ? (
                    <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Stack spacing={3}>
                        {/* Header info */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
                            <Box>
                                <Typography variant="h5" fontWeight={700}>
                                    {invoice.invoiceNumber}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {invoice.institutionName}
                                </Typography>
                            </Box>
                            <Chip
                                label={invoice.status}
                                color={statusColors[invoice.status]}
                                sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
                            />
                        </Stack>

                        {/* Key details grid */}
                        <Box
                            sx={{
                                display: 'grid',
                                gap: 2,
                                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                            }}
                        >
                            <Box>
                                <Typography variant="body2" color="text.secondary">Billing Period</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {formatBillingPeriod(invoice.year, invoice.month)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Active Users</Typography>
                                <Typography variant="body1" fontWeight={600}>{invoice.userCount}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Due Date</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {formatDate(invoice.dueDate)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Total Due</Typography>
                                <Typography variant="h6" fontWeight={800}>
                                    {currency.format(invoice.totalAmountZar)}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider />

                        {/* Rate tier explanation */}
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                            }}
                        >
                            <Typography variant="subtitle2" gutterBottom>
                                Rate Tier Applied
                            </Typography>
                            <Typography variant="body2">
                                {invoice.rateTier}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.85 }}>
                                Tiers: 0–99 users = R99/user · 100–399 users = R69/user · 400+ users = R49/user
                                {invoice.creatorEnabled && ' · Creator add-on = R20/user'}
                            </Typography>
                        </Box>

                        {/* Line items table */}
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" gutterBottom>
                                Line Items
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Description</TableCell>
                                            <TableCell align="right">Qty</TableCell>
                                            <TableCell align="right">Unit Price</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoice.lineItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.description}</TableCell>
                                                <TableCell align="right">{item.quantity}</TableCell>
                                                <TableCell align="right">{currency.format(item.unitPriceZar)}</TableCell>
                                                <TableCell align="right">
                                                    <Typography fontWeight={600}>{currency.format(item.totalZar)}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Totals */}
                        <Stack spacing={1} alignItems="flex-end" sx={{ pr: 2 }}>
                            <Stack direction="row" spacing={4}>
                                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {currency.format(invoice.subtotalZar)}
                                </Typography>
                            </Stack>
                            {invoice.creatorEnabled && (
                                <Stack direction="row" spacing={4}>
                                    <Typography variant="body2" color="text.secondary">Creator Add-on</Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {currency.format(invoice.creatorTotalZar)}
                                    </Typography>
                                </Stack>
                            )}
                            <Divider sx={{ width: 200 }} />
                            <Stack direction="row" spacing={4}>
                                <Typography variant="body1" fontWeight={700}>Total Due</Typography>
                                <Typography variant="h6" fontWeight={800}>
                                    {currency.format(invoice.totalAmountZar)}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Divider />

                        {/* Status timeline */}
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" gutterBottom>
                                Timeline
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2">
                                    <strong>Created:</strong> {formatDate(invoice.createdAt)}
                                </Typography>
                                {invoice.sentAt && (
                                    <Typography variant="body2">
                                        <strong>Sent:</strong> {formatDate(invoice.sentAt)}
                                        {invoice.sentToEmail && ` to ${invoice.sentToEmail}`}
                                    </Typography>
                                )}
                                {invoice.paidAt && (
                                    <Typography variant="body2">
                                        <strong>Paid:</strong> {formatDate(invoice.paidAt)}
                                        {invoice.paymentReference && ` · Ref: ${invoice.paymentReference}`}
                                    </Typography>
                                )}
                                {invoice.notes && (
                                    <Typography variant="body2">
                                        <strong>Notes:</strong> {invoice.notes}
                                    </Typography>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                )}
            </DialogContent>
        </Dialog>
    );
}
