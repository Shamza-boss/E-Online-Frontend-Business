import React from 'react';
import {
    Box,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { BillingSummaryDto, InstitutionBillingDashboardDto } from '@/app/_lib/interfaces/types';

interface BillingOverviewCardProps {
    summary?: BillingSummaryDto;
    billingDashboard?: InstitutionBillingDashboardDto;
    loading?: boolean;
    institutionName?: string;
}

const currency = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    currencyDisplay: 'symbol',
});

const formatMonth = (summary?: BillingSummaryDto) => {
    if (!summary) return '—';
    const date = new Date(summary.year, summary.month - 1, 1);
    return format(date, 'MMMM yyyy');
};

export default function BillingOverviewCard({
    summary,
    billingDashboard,
    loading,
    institutionName,
}: BillingOverviewCardProps) {
    if (loading && !summary) {
        return (
            <Paper sx={{ borderRadius: 3, p: 3 }}>
                <Stack alignItems="center" sx={{ py: 4 }}>
                    <CircularProgress />
                </Stack>
            </Paper>
        );
    }

    if (!summary) {
        return (
            <Paper sx={{ borderRadius: 3, p: 3 }}>
                <Typography variant="body1" color="text.secondary" align="center">
                    Select an institution to view its current billing summary.
                </Typography>
            </Paper>
        );
    }

    const marginColor =
        billingDashboard && billingDashboard.profitMarginPercent >= 75
            ? 'success'
            : billingDashboard && billingDashboard.profitMarginPercent >= 35
                ? 'warning'
                : 'error';

    return (
        <Paper sx={{ borderRadius: 3, p: 3 }}>
            <Stack spacing={2}>
                <Box>
                    <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
                        {institutionName ?? summary.institutionName}
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                        Current invoice · {formatMonth(summary)}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                        label={summary.creatorEnabled ? 'Creator Enabled' : 'Standard'}
                        color={summary.creatorEnabled ? 'secondary' : 'primary'}
                        variant="outlined"
                    />
                    <Chip
                        label={`${summary.userCount} users`}
                        variant="outlined"
                    />
                </Stack>

                <Box
                    sx={{
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: {
                            xs: 'repeat(2, 1fr)',
                            md: 'repeat(4, 1fr)',
                        },
                    }}
                >
                    <Box>
                        <Typography variant="body2" color="text.secondary">Users</Typography>
                        <Typography variant="h6" fontWeight={700}>{summary.userCount}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">Rate / user</Typography>
                        <Typography variant="h6" fontWeight={700}>{currency.format(summary.ratePerUserZar)}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">Creator add-on / user</Typography>
                        <Typography variant="h6" fontWeight={700}>{currency.format(summary.creatorAddonPerUserZar)}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">Total due</Typography>
                        <Typography variant="h5" fontWeight={800}>{currency.format(summary.totalPrice)}</Typography>
                    </Box>
                </Box>

                {billingDashboard && (
                    <>
                        <Divider />
                        <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
                            Cost & Profitability
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gap: 2,
                                gridTemplateColumns: {
                                    xs: 'repeat(2, 1fr)',
                                    md: 'repeat(5, 1fr)',
                                },
                            }}
                        >
                            <Box>
                                <Typography variant="body2" color="text.secondary">Monthly Revenue</Typography>
                                <Typography variant="h6" fontWeight={700}>
                                    {currency.format(billingDashboard.monthlyRevenueZar)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Total Cost (ZAR)</Typography>
                                <Typography variant="h6" fontWeight={700}>
                                    {currency.format(billingDashboard.totalCostZar)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Cost / user</Typography>
                                <Typography variant="h6" fontWeight={700}>
                                    {currency.format(billingDashboard.costPerUserZar)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Profit</Typography>
                                <Typography variant="h6" fontWeight={700} color={billingDashboard.profitZar >= 0 ? 'success.main' : 'error.main'}>
                                    {currency.format(billingDashboard.profitZar)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Profit Margin</Typography>
                                <Chip
                                    label={`${billingDashboard.profitMarginPercent.toFixed(1)}%`}
                                    color={marginColor}
                                    variant="filled"
                                    size="medium"
                                    sx={{ fontWeight: 700, fontSize: '1rem', mt: 0.5 }}
                                />
                            </Box>
                        </Box>
                    </>
                )}
            </Stack>
        </Paper>
    );
}
