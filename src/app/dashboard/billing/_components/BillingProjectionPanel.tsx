import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    LinearProgress,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import { format } from 'date-fns';
import {
    BillingProjectionDto,
    BillingSummaryDto,
} from '@/app/_lib/interfaces/types';

interface BillingProjectionPanelProps {
    projection?: BillingProjectionDto;
    summary?: BillingSummaryDto;
    loading?: boolean;
    error?: Error;
    onRefresh?: () => void;
}

const currencyZar = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    currencyDisplay: 'symbol',
});

const DEFAULT_USD_TO_ZAR = 19;
const usdToZarRate = Number(process.env.NEXT_PUBLIC_USD_TO_ZAR ?? DEFAULT_USD_TO_ZAR) || DEFAULT_USD_TO_ZAR;

const convertUsdToZar = (value: number) => value * usdToZarRate;

const percent = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 1,
});

const numberFormat = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
});

const formatStorageVolume = (gigabytes: number) => {
    if (!Number.isFinite(gigabytes) || gigabytes <= 0) {
        return '0 MB';
    }

    const megabytes = gigabytes * 1024;
    if (megabytes < 1024) {
        return `${Number(megabytes.toFixed(1))} MB`;
    }

    return `${Number(gigabytes.toFixed(5))} GB`;
};

export default function BillingProjectionPanel({
    projection,
    summary,
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
            <Paper sx={{ borderRadius: 3, p: 3 }}>
                <Stack alignItems="center" sx={{ py: 4 }}>
                    <CircularProgress />
                </Stack>
            </Paper>
        );
    }

    if (!projection) {
        return (
            <Paper sx={{ borderRadius: 3, p: 3 }}>
                <Typography variant="body1" color="text.secondary" align="center">
                    Select an institution to see usage projections, costs, and margin details.
                </Typography>
            </Paper>
        );
    }

    const allowedUsers = summary?.allowedUsers ?? 0;
    const enrolledPeak = projection.usage?.enrolledUsersPeak ?? summary?.enrolledUsers ?? 0;
    const usageRatio = allowedUsers > 0 ? (enrolledPeak / allowedUsers) * 100 : 0;
    const progressPalette: 'error' | 'warning' | 'success' =
        usageRatio > 100 ? 'error' : usageRatio > 85 ? 'warning' : 'success';
    const usageChipColor: ChipProps['color'] =
        usageRatio > 100 ? 'error' : usageRatio > 85 ? 'warning' : 'success';

    const chargeTotal = projection.chargeTotal;
    const infraCostZar = convertUsdToZar(projection.costsUsd.totalUsd);
    const expectedMargin = projection.expectedMargin ?? 0;
    const safeMargin = Math.max(-1, Math.min(1, expectedMargin));
    const marginLabel = percent.format(safeMargin);
    const projectionMonth = format(new Date(projection.year, projection.month - 1, 1), 'MMMM yyyy');

    const usageMetrics = [
        { label: 'Stored minutes', value: `${numberFormat.format(projection.usage.storedVideoMinutes)} min` },
        { label: 'Delivered minutes', value: `${numberFormat.format(projection.usage.deliveredVideoMinutes)} min` },
        { label: 'PDF storage', value: formatStorageVolume(projection.usage.pdfStorageGb) },
        { label: 'PDF downloads', value: numberFormat.format(projection.usage.pdfDownloads) },
    ];

    const costBreakdown = [
        { label: 'Cloudflare storage', value: convertUsdToZar(projection.costsUsd.cloudflareStoredUsd) },
        { label: 'Cloudflare delivery', value: convertUsdToZar(projection.costsUsd.cloudflareDeliveredUsd) },
        { label: 'Railway CPU', value: convertUsdToZar(projection.costsUsd.railwayCpuUsd) },
        { label: 'Railway memory', value: convertUsdToZar(projection.costsUsd.railwayMemoryUsd) },
        { label: 'Railway volume', value: convertUsdToZar(projection.costsUsd.railwayVolumeUsd) },
        { label: 'Railway egress', value: convertUsdToZar(projection.costsUsd.railwayEgressUsd) },
        { label: 'Railway object storage', value: convertUsdToZar(projection.costsUsd.railwayObjectStorageUsd) },
    ];

    return (
        <Paper sx={{ borderRadius: 3, p: 3 }}>
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

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <Box sx={{ flex: 1, border: (theme) => `1px dashed ${theme.palette.success.light}`, borderRadius: 2, p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Charge to institution
                        </Typography>
                        <Typography variant="h4" fontWeight={800}>
                            {currencyZar.format(chargeTotal)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Base + creator add-on + enterprise overage
                        </Typography>
                    </Box>
                    <Box sx={{ flex: 1, border: (theme) => `1px dashed ${theme.palette.info.light}`, borderRadius: 2, p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Infra cost exposure
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                            {currencyZar.format(infraCostZar)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Cloudflare + Railway usage · converted at R{usdToZarRate.toFixed(2)}/$
                        </Typography>
                    </Box>
                    <Box sx={{ flex: 1, border: (theme) => `1px dashed ${theme.palette.primary.light}`, borderRadius: 2, p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Expected margin
                        </Typography>
                        <Typography variant="h4" fontWeight={800}>
                            {marginLabel}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {(expectedMargin * 100).toFixed(1)}% of projected charge retained
                        </Typography>
                    </Box>
                </Stack>

                <Box>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
                            Enrollment pressure
                        </Typography>
                        <Chip
                            label={allowedUsers > 0 ? `${Math.round(usageRatio)}% of allowed users` : 'No cap available'}
                            color={usageChipColor}
                            variant="outlined"
                            size="small"
                        />
                    </Stack>
                    <Box sx={{ mt: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min(usageRatio, 100)}
                            sx={{
                                height: 8,
                                borderRadius: 5,
                                backgroundColor: (theme) => theme.palette.action.hover,
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: (theme) => theme.palette[progressPalette].main,
                                },
                            }}
                        />
                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Peak enrolled: {enrolledPeak.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Allowed users: {allowedUsers > 0 ? allowedUsers.toLocaleString() : '—'}
                            </Typography>
                        </Stack>
                    </Box>
                </Box>

                <Divider />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" gutterBottom>
                            Usage signals
                        </Typography>
                        <Stack spacing={1.5}>
                            {usageMetrics.map((metric) => (
                                <Box key={metric.label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {metric.label}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {metric.value}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" gutterBottom>
                            Cost breakdown (ZAR)
                        </Typography>
                        <Stack spacing={1.5}>
                            {costBreakdown.map((cost) => (
                                <Box key={cost.label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {cost.label}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {currencyZar.format(cost.value)}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
        </Paper>
    );
}
