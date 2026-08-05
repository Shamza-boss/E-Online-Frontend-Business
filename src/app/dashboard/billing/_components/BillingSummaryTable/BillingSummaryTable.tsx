import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    Alert,
    Chip,
    CircularProgress,
    IconButton,
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
import type { BillingSummaryTableProps } from './types';
import { statusColors } from './constants';
import { formatBillingMonth, formatCurrency } from './utils';
import InvoiceActionsMenu from '../InvoiceActionsMenu';
import {
    TablePaper,
    HeaderStack,
    CenteredLoadingBox,
    EmptyStateBox,
    ClickableRow,
    StatusChip,
} from './elements';

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
        <TablePaper>
            <HeaderStack direction="row" alignItems="center" justifyContent="flex-end">
                <Tooltip title="Refresh invoices">
                    <span>
                        <IconButton onClick={onRefresh} disabled={loading} aria-label="Refresh billing data">
                            {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                        </IconButton>
                    </span>
                </Tooltip>
            </HeaderStack>

            {loading ? (
                <CenteredLoadingBox>
                    <CircularProgress />
                </CenteredLoadingBox>
            ) : isEmpty ? (
                <EmptyStateBox>
                    <Typography color="text.secondary" align="center">
                        No invoices yet
                        {institutionName ? ` for ${institutionName}` : ''}. Generate one above to get started.
                    </Typography>
                </EmptyStateBox>
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
                                <ClickableRow
                                    key={invoice.id}
                                    hover
                                    onClick={() => onViewDetail(invoice)}
                                >
                                    <TableCell>
                                        <Typography fontWeight={600} variant="body2">
                                            {invoice.invoiceNumber}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{formatBillingMonth(invoice)}</TableCell>
                                    <TableCell align="center">
                                        <StatusChip
                                            label={invoice.status}
                                            size="small"
                                            color={statusColors[invoice.status]}
                                            variant="filled"
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
                                </ClickableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </TablePaper>
    );
}
