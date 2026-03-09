import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import { format } from 'date-fns';
import type { InvoiceDto, InvoiceStatus } from '@/app/_lib/interfaces/types';
import InvoiceActionsMenu from './InvoiceActionsMenu';

interface BillingSummaryTableProps {
    invoices?: InvoiceDto[];
    loading?: boolean;
    error?: Error;
    onRefresh?: () => void;
    institutionName?: string;
    onSend: (invoice: InvoiceDto) => void;
    onMarkPaid: (invoice: InvoiceDto) => void;
    onDownloadPdf: (invoice: InvoiceDto) => Promise<void>;
    onCancel: (invoice: InvoiceDto) => Promise<void>;
    onUnpay: (invoice: InvoiceDto) => Promise<void>;
    onViewDetail: (invoice: InvoiceDto) => void;
}

const currency = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    currencyDisplay: 'symbol',
});

const formatBillingMonth = (invoice: InvoiceDto) => {
    const date = new Date(invoice.year, invoice.month - 1, 1);
    return format(date, 'MMM yyyy');
};

const formatCurrency = (value?: number) => currency.format(value ?? 0);

const statusColors: Record<InvoiceStatus, 'default' | 'primary' | 'warning' | 'success' | 'error'> = {
    Draft: 'primary',
    Sent: 'warning',
    Paid: 'success',
    Overdue: 'error',
    Cancelled: 'default',
};

export default function BillingSummaryTable({
    invoices,
    loading,
    error,
    onRefresh,
    institutionName,
    onSend,
    onMarkPaid,
    onDownloadPdf,
    onCancel,
    onUnpay,
    onViewDetail,
}: BillingSummaryTableProps) {
    if (error) {
        return (
            <Alert severity="error">
                We could not load the billing summary right now. Please try refreshing the data.
            </Alert>
        );
    }

    const rows = invoices ?? [];
    const isEmpty = !loading && rows.length === 0;

    return (
        <Paper sx={{ borderRadius: 3, p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 2 }}>
                <Box>
                    <Typography variant="h6">Invoice History</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Review previously generated invoices for {institutionName ?? 'this institution'}.
                    </Typography>
                </Box>
                <Tooltip title="Refresh">
                    <span>
                        <IconButton onClick={onRefresh} disabled={loading} aria-label="Refresh billing data">
                            {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                        </IconButton>
                    </span>
                </Tooltip>
            </Stack>

            {loading ? (
                <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : isEmpty ? (
                <Box sx={{ py: 4 }}>
                    <Typography color="text.secondary" align="center">
                        No invoices found yet. Generate an invoice for this institution to get started.
                    </Typography>
                </Box>
            ) : (
                <TableContainer>
                    <Table size="medium">
                        <TableHead>
                            <TableRow>
                                <TableCell>Invoice #</TableCell>
                                <TableCell>Billing Month</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="right">Users</TableCell>
                                <TableCell align="center">Creator</TableCell>
                                <TableCell align="right">Rate / User</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell>Due Date</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((invoice) => (
                                <TableRow
                                    key={invoice.id}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => onViewDetail(invoice)}
                                >
                                    <TableCell>
                                        <Typography fontWeight={600} variant="body2">
                                            {invoice.invoiceNumber}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{formatBillingMonth(invoice)}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={invoice.status}
                                            size="small"
                                            color={statusColors[invoice.status]}
                                            variant="filled"
                                            sx={{ fontWeight: 600, minWidth: 72 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">{invoice.userCount}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={invoice.creatorEnabled ? 'Yes' : 'No'}
                                            size="small"
                                            color={invoice.creatorEnabled ? 'secondary' : 'default'}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">{formatCurrency(invoice.ratePerUserZar)}</TableCell>
                                    <TableCell align="right">
                                        <Typography fontWeight={700}>{formatCurrency(invoice.totalAmountZar)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {format(new Date(invoice.dueDate), 'dd MMM yyyy')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                                        <InvoiceActionsMenu
                                            invoice={invoice}
                                            onSend={onSend}
                                            onMarkPaid={onMarkPaid}
                                            onDownloadPdf={onDownloadPdf}
                                            onCancel={onCancel}
                                            onUnpay={onUnpay}
                                            onViewDetail={onViewDetail}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
}
