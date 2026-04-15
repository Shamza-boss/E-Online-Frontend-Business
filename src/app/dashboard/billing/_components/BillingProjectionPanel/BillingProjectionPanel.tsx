import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    Alert,
    Box,
    CircularProgress,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { format } from 'date-fns';
import type { BillingProjectionPanelProps } from './interfaces';
import {
    currencyZar,
    currencyUsd,
    usdToZarRate,
    percent,
    numberFormat,
} from './constants';
import {
    convertUsdToZar,
    formatStorageVolume,
    buildUsageMetrics,
    buildCostBreakdown,
} from './utils';
import {
    RoundedPaper,
    CenteredLoadingStack,
    MetricHighlightBox,
    DashboardCostBox,
    FlexBox,
    SpacedRow,
    ResponsiveGrid4,
} from './elements';

export default function BillingProjectionPanel({
    projection,
    billingDashboard,
    loading,
    error,
    onRefresh,
}: BillingProjectionPanelProps) {
    if (error) {
        return (
            <Alert severity="error">
                Unable to fetch the projection right now. Please refresh to try again.
            </Alert>
        );
    }

    const showLoadingState = loading && !projection;

    if (showLoadingState) {
        return (
            <RoundedPaper>
                <CenteredLoadingStack alignItems="center">
                    <CircularProgress />
                </CenteredLoadingStack>
            </RoundedPaper>
        );
    }

    if (!projection) {
        return (
            <RoundedPaper>
                <Typography variant="body1" color="text.secondary" align="center">
                    Select an institution to see usage projections, costs, and margin details.
                </Typography>
            </RoundedPaper>
        );
    }

    const chargeTotal = projection.chargeTotal;
    const infraCostZar = convertUsdToZar(projection.costsUsd.totalUsd);
    const expectedMargin = projection.expectedMargin ?? 0;
    const safeMargin = Math.max(-1, Math.min(1, expectedMargin));
    const marginLabel = percent.format(safeMargin);
    const projectionMonth = format(new Date(projection.year, projection.month - 1, 1), 'MMMM yyyy');

    const usageMetrics = buildUsageMetrics(projection);
    const costBreakdown = buildCostBreakdown(projection);

    return (
        <RoundedPaper>
            <Stack spacing={3}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
                            Usage & margin projection
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                            {projectionMonth}
                        </Typography>
                    </Box>
                    <Tooltip title="Refresh projection">
                        <span>
                            <IconButton onClick={onRefresh} disabled={loading} aria-label="Refresh projection data">
                                {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>

                {/* Key financial metrics */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <MetricHighlightBox $variant="success">
                        <Typography variant="body2" color="text.secondary">
                            Charge to institution
                        </Typography>
                        <Typography variant="h4" fontWeight={800}>
                            {currencyZar.format(chargeTotal)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Based on per-user tiered pricing
                        </Typography>
                    </MetricHighlightBox>
                    <MetricHighlightBox $variant="info">
                        <Typography variant="body2" color="text.secondary">
                            Infra cost exposure
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                            {currencyZar.format(infraCostZar)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Cloudflare + Railway usage · converted at R{usdToZarRate.toFixed(2)}/$
                        </Typography>
                    </MetricHighlightBox>
                    <MetricHighlightBox $variant="primary">
                        <Typography variant="body2" color="text.secondary">
                            Expected margin
                        </Typography>
                        <Typography variant="h4" fontWeight={800}>
                            {marginLabel}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {(expectedMargin * 100).toFixed(1)}% of projected charge retained
                        </Typography>
                    </MetricHighlightBox>
                </Stack>

                {/* Projected monthly cost from billing dashboard */}
                {billingDashboard && (
                    <DashboardCostBox>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
                            <Box>
                                <Typography variant="body2" color="text.secondary">Projected monthly cost (ZAR)</Typography>
                                <Typography variant="h6" fontWeight={700}>
                                    {currencyZar.format(billingDashboard.projectedMonthlyCostZar)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Cost per user (ZAR)</Typography>
                                <Typography variant="h6" fontWeight={700}>
                                    {currencyZar.format(billingDashboard.costPerUserZar)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Profit (ZAR)</Typography>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    color={billingDashboard.profitZar >= 0 ? 'success.main' : 'error.main'}
                                >
                                    {currencyZar.format(billingDashboard.profitZar)}
                                </Typography>
                            </Box>
                        </Stack>
                    </DashboardCostBox>
                )}

                <Divider />

                {/* Usage and cost breakdown side-by-side */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <FlexBox>
                        <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" gutterBottom>
                            Usage signals
                        </Typography>
                        <Stack spacing={1.5}>
                            {usageMetrics.map((metric) => (
                                <SpacedRow key={metric.label}>
                                    <Typography variant="body2" color="text.secondary">
                                        {metric.label}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {metric.value}
                                    </Typography>
                                </SpacedRow>
                            ))}
                        </Stack>
                    </FlexBox>
                    <FlexBox>
                        <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" gutterBottom>
                            Cost breakdown (ZAR)
                        </Typography>
                        <Stack spacing={1.5}>
                            {costBreakdown.map((cost) => (
                                <SpacedRow key={cost.label}>
                                    <Typography variant="body2" color="text.secondary">
                                        {cost.label}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {currencyZar.format(cost.value)}
                                    </Typography>
                                </SpacedRow>
                            ))}
                        </Stack>
                    </FlexBox>
                </Stack>

                {/* Usage metrics from billing dashboard (Cloudflare/Railway detail) */}
                {billingDashboard && (
                    <>
                        <Divider />
                        <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
                            Accumulated usage metrics (current month)
                        </Typography>
                        <ResponsiveGrid4>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Stored video</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {numberFormat.format(billingDashboard.usageMetrics.storedVideoMinutes)} min
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Delivered video</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {numberFormat.format(billingDashboard.usageMetrics.deliveredVideoMinutes)} min
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">PDF storage</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {formatStorageVolume(billingDashboard.usageMetrics.pdfStorageGb)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">PDF downloads</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {billingDashboard.usageMetrics.pdfDownloads.toLocaleString()}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Cloudflare cost</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {currencyUsd.format(billingDashboard.usageMetrics.cloudflareCostUsd)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Railway cost</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {currencyUsd.format(billingDashboard.usageMetrics.railwayCostUsd)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Total infra cost (USD)</Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {currencyUsd.format(billingDashboard.usageMetrics.totalCostUsd)}
                                </Typography>
                            </Box>
                        </ResponsiveGrid4>
                    </>
                )}
            </Stack>
        </RoundedPaper>
    );
}
