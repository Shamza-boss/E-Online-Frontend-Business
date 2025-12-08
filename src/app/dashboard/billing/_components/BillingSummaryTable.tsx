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
import { BillingSummaryDto } from '@/app/_lib/interfaces/types';

interface BillingSummaryTableProps {
    history?: BillingSummaryDto[];
    loading?: boolean;
    error?: Error;
    onRefresh?: () => void;
    institutionName?: string;
}

const currency = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    currencyDisplay: 'symbol',
});

const formatBillingMonth = (summary: BillingSummaryDto) => {
    const date = new Date(summary.year, summary.month - 1, 1);
    return format(date, 'MMM yyyy');
};

const formatCurrency = (value?: number) => currency.format(value ?? 0);

export default function BillingSummaryTable({
    history,
    loading,
    error,
    onRefresh,
    institutionName,
}: BillingSummaryTableProps) {
    if (error) {
        return (
            <Alert severity="error">
                We could not load the billing summary right now. Please try refreshing the data.
            </Alert>
        );
    }

    const rows = history ?? [];
    const isEmpty = !loading && rows.length === 0;

    return (
        <Paper sx={{ borderRadius: 3, p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pb: 2 }}>
                <Box>
                    <Typography variant="h6">Billing History</Typography>
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
                        No billing records found yet. Once invoices are generated, they will appear in this list.
                    </Typography>
                </Box>
            ) : (
                <TableContainer>
                    <Table size="medium">
                        <TableHead>
                            <TableRow>
                                <TableCell>Institution</TableCell>
                                <TableCell>Plan</TableCell>
                                <TableCell>Billing Month</TableCell>
                                <TableCell align="right">Active Users</TableCell>
                                <TableCell align="right">Enrolled Users</TableCell>
                                <TableCell align="right">Allowed Users</TableCell>
                                <TableCell align="right">Overage Users</TableCell>
                                <TableCell align="right">Base</TableCell>
                                <TableCell align="right">Add-ons</TableCell>
                                <TableCell align="right">Overage</TableCell>
                                <TableCell align="right">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((summary) => (
                                <TableRow key={`${summary.institutionName}-${summary.year}-${summary.month}`} hover>
                                    <TableCell>
                                        <Typography fontWeight={600}>{summary.institutionName}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {summary.subscription}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={summary.subscription} size="small" color="primary" variant="outlined" />
                                    </TableCell>
                                    <TableCell>{formatBillingMonth(summary)}</TableCell>
                                    <TableCell align="right">{summary.activeUsers}</TableCell>
                                    <TableCell align="right">{summary.enrolledUsers}</TableCell>
                                    <TableCell align="right">{summary.allowedUsers}</TableCell>
                                    <TableCell align="right">{summary.overageUsers}</TableCell>
                                    <TableCell align="right">{formatCurrency(summary.baseMonthlyPrice)}</TableCell>
                                    <TableCell align="right">{formatCurrency(summary.addonsMonthlyPrice)}</TableCell>
                                    <TableCell align="right">{formatCurrency(summary.overagePrice)}</TableCell>
                                    <TableCell align="right">
                                        <Typography fontWeight={700}>{formatCurrency(summary.totalPrice)}</Typography>
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
