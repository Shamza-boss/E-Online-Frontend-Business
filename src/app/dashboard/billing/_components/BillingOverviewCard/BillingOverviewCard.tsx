import React from 'react';
import {
    Box,
    Chip,
    CircularProgress,
    Divider,
    Stack,
    Typography,
} from '@mui/material';
import type { BillingOverviewCardProps } from './types';
import { CURRENCY_ZAR } from './constants';
import { formatMonth, getMarginColor } from './utils';
import { RoundedPaper, CenteredLoadingStack, ResponsiveGrid4, ResponsiveGrid5 } from './elements';

export default function BillingOverviewCard({
    summary,
    billingDashboard,
    loading,
    institutionName,
}: BillingOverviewCardProps) {
    if (loading && !summary) {
        return (
            <RoundedPaper>
                <CenteredLoadingStack alignItems="center">
                    <CircularProgress />
                </CenteredLoadingStack>
            </RoundedPaper>
        );
    }

    if (!summary) {
        return (
            <RoundedPaper>
                <Typography variant="body1" color="text.secondary" align="center">
                    Select an institution to view its current billing summary.
                </Typography>
            </RoundedPaper>
        );
    }

    const marginColor = getMarginColor(billingDashboard);

    return (
        <RoundedPaper>
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

                <ResponsiveGrid4>
                    <Box>
                        <Typography variant="body2" color="text.secondary">Users</Typography>
                        <Typography variant="h6" fontWeight={700}>{summary.userCount}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">Rate / user</Typography>
                        <Typography variant="h6" fontWeight={700}>{CURRENCY_ZAR.format(summary.ratePerUserZar)}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">Creator add-on / user</Typography>
                        <Typography variant="h6" fontWeight={700}>{CURRENCY_ZAR.format(summary.creatorAddonPerUserZar)}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">Total due</Typography>
                        <Typography variant="h5" fontWeight={800}>{CURRENCY_ZAR.format(summary.totalPrice)}</Typography>
                    </Box>
                </ResponsiveGrid4>

                {billingDashboard && (
                    <>
                        <Divider />
                        <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
                            Cost & Profitability
                        </Typography>
                        <ResponsiveGrid5>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Monthly Revenue</Typography>
                                <Typography variant="h6" fontWeight={700}>
                                    {CURRENCY_ZAR.format(billingDashboard.monthlyRevenueZar)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Total Cost (ZAR)</Typography>
                                <Typography variant="h6" fontWeight={700}>
                                    {CURRENCY_ZAR.format(billingDashboard.totalCostZar)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Cost / User</Typography>
                                <Typography variant="h6" fontWeight={700}>
                                    {CURRENCY_ZAR.format(billingDashboard.costPerUserZar)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Profit</Typography>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    color={billingDashboard.profitZar >= 0 ? 'success.main' : 'error.main'}
                                >
                                    {CURRENCY_ZAR.format(billingDashboard.profitZar)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Profit Margin</Typography>
                                <Chip
                                    label={`${billingDashboard.profitMarginPercent.toFixed(1)}%`}
                                    color={marginColor}
                                    size="small"
                                />
                            </Box>
                        </ResponsiveGrid5>
                    </>
                )}
            </Stack>
        </RoundedPaper>
    );
}
