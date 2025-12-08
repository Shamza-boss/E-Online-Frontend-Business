import React from 'react';
import {
    Box,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { BillingSummaryDto } from '@/app/_lib/interfaces/types';

interface BillingOverviewCardProps {
    summary?: BillingSummaryDto;
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
                    Select an institution to view its current invoice summary.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ borderRadius: 3, p: 3 }}>
            <Stack spacing={1}>
                <Box>
                    <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
                        {institutionName ?? summary.institutionName}
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                        Current invoice · {formatMonth(summary)}
                    </Typography>
                </Box>
                <Chip label={summary.subscription} color="primary" variant="outlined" sx={{ maxWidth: 'max-content' }} />
                <Box
                    sx={{
                        mt: 1,
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: {
                            xs: 'repeat(12, minmax(0, 1fr))',
                            md: 'repeat(12, minmax(0, 1fr))',
                        },
                    }}
                >
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                        <Typography variant="body2" color="text.secondary">
                            Active users
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                            {summary.activeUsers}
                        </Typography>
                    </Box>
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                        <Typography variant="body2" color="text.secondary">
                            Enrolled users
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                            {summary.enrolledUsers}
                        </Typography>
                    </Box>
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                        <Typography variant="body2" color="text.secondary">
                            Allowed users
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>{summary.allowedUsers}</Typography>
                    </Box>
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                        <Typography variant="body2" color="text.secondary">
                            Overage users
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>{summary.overageUsers}</Typography>
                    </Box>
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                        <Typography variant="body2" color="text.secondary">
                            Base price
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                            {currency.format(summary.baseMonthlyPrice)}
                        </Typography>
                    </Box>
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                        <Typography variant="body2" color="text.secondary">
                            Add-ons
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                            {currency.format(summary.addonsMonthlyPrice)}
                        </Typography>
                    </Box>
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                        <Typography variant="body2" color="text.secondary">
                            Overage
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                            {currency.format(summary.overagePrice)}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Total due
                    </Typography>
                    <Typography variant="h4" fontWeight={800}>
                        {currency.format(summary.totalPrice)}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
}
