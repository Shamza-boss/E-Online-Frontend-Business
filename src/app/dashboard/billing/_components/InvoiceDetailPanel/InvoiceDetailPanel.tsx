'use client';

import React from 'react';
import {
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
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
import type { InvoiceDetailPanelProps } from './interfaces';
import { CURRENCY_ZAR, statusColors } from './constants';
import { formatDate, formatBillingPeriod } from './utils';
import {
    StyledDialogTitle,
    LoadingBox,
    StatusChip,
    DetailsGrid,
    RateTierBox,
    TierCaption,
    TotalsStack,
    NarrowDivider,
} from './elements';

export default function InvoiceDetailPanel({
    open,
    invoice,
    loading,
    onClose,
}: InvoiceDetailPanelProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <StyledDialogTitle>
                <span>Invoice Details</span>
                <IconButton onClick={onClose} size="small" aria-label="Close">
                    <CloseIcon />
                </IconButton>
            </StyledDialogTitle>
            <DialogContent dividers>
                {loading || !invoice ? (
                    <LoadingBox>
                        <CircularProgress />
                    </LoadingBox>
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
                            <StatusChip
                                label={invoice.status}
                                color={statusColors[invoice.status]}
                            />
                        </Stack>

                        {/* Key details grid */}
                        <DetailsGrid>
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
                                    {CURRENCY_ZAR.format(invoice.totalAmountZar)}
                                </Typography>
                            </Box>
                        </DetailsGrid>

                        <Divider />

                        {/* Rate tier explanation */}
                        <RateTierBox>
                            <Typography variant="subtitle2" gutterBottom>
                                Rate Tier Applied
                            </Typography>
                            <Typography variant="body2">
                                {invoice.rateTier}
                            </Typography>
                            <TierCaption variant="caption">
                                Tiers: 0–99 users = R99/user · 100–399 users = R69/user · 400+ users = R49/user
                                {invoice.creatorEnabled && ' · Creator add-on = R20/user'}
                            </TierCaption>
                        </RateTierBox>

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
                                                <TableCell align="right">{CURRENCY_ZAR.format(item.unitPriceZar)}</TableCell>
                                                <TableCell align="right">
                                                    <Typography fontWeight={600}>{CURRENCY_ZAR.format(item.totalZar)}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Totals */}
                        <TotalsStack spacing={1} alignItems="flex-end">
                            <Stack direction="row" spacing={4}>
                                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {CURRENCY_ZAR.format(invoice.subtotalZar)}
                                </Typography>
                            </Stack>
                            {invoice.creatorEnabled && (
                                <Stack direction="row" spacing={4}>
                                    <Typography variant="body2" color="text.secondary">Creator Add-on</Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {CURRENCY_ZAR.format(invoice.creatorTotalZar)}
                                    </Typography>
                                </Stack>
                            )}
                            <NarrowDivider />
                            <Stack direction="row" spacing={4}>
                                <Typography variant="body1" fontWeight={700}>Total Due</Typography>
                                <Typography variant="h6" fontWeight={800}>
                                    {CURRENCY_ZAR.format(invoice.totalAmountZar)}
                                </Typography>
                            </Stack>
                        </TotalsStack>

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
