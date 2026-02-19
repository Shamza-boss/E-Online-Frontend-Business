'use client';

import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { usePlatformOwnerDashboard } from '@/app/_lib/hooks/useDashboard';
import type { PlatformOwnerDashboardDto } from '@/app/_lib/interfaces/types';

const currencyZar = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    currencyDisplay: 'symbol',
});

const percentFormat = (value: number) => `${value.toFixed(1)}%`;

interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
}

function MetricCard({ title, value, icon, color, subtitle }: MetricCardProps) {
    return (
        <Card
            sx={{
                height: '100%',
                borderRadius: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
        >
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight={800}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: color,
                            borderRadius: 2,
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {icon}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

function MarginBucketBar({
    label,
    count,
    total,
    color,
}: {
    label: string;
    count: number;
    total: number;
    color: string;
}) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="body2" fontWeight={600}>
                    {label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {count} institution{count !== 1 ? 's' : ''} ({pct.toFixed(0)}%)
                </Typography>
            </Stack>
            <Box
                sx={{
                    width: '100%',
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: (theme) => theme.palette.action.hover,
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        width: `${Math.min(pct, 100)}%`,
                        height: '100%',
                        borderRadius: 5,
                        backgroundColor: color,
                        transition: 'width 0.5s ease',
                    }}
                />
            </Box>
        </Box>
    );
}

export default function PlatformOwnerDashboard() {
    const { data, isLoading, error } = usePlatformOwnerDashboard();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !data) {
        return (
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography color="error">
                    Unable to load the platform dashboard. Please try refreshing.
                </Typography>
            </Paper>
        );
    }

    const bucketTotal =
        data.profitMarginBuckets.below35 +
        data.profitMarginBuckets.between35And75 +
        data.profitMarginBuckets.above75;

    return (
        <Grid container spacing={3} p={3}>
            {/* Header */}
            <Grid size={{ xs: 12 }}>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Platform Owner Dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 'max-content' }}>
                        A birds-eye view of your platform over the <strong>last 30 days</strong>. Monitor institution
                        activity, costs, and profitability at a glance.
                    </Typography>
                </Box>
            </Grid>

            {/* Top Metric Cards */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <MetricCard
                    title="Institutions"
                    value={data.totalInstitutions.toLocaleString()}
                    icon={<BusinessIcon sx={{ color: '#fff' }} />}
                    color="#1976d2"
                    subtitle="Total registered"
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <MetricCard
                    title="Users"
                    value={data.totalUsers.toLocaleString()}
                    icon={<PeopleIcon sx={{ color: '#fff' }} />}
                    color="#2e7d32"
                    subtitle="Across all institutions"
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <MetricCard
                    title="Total Cost"
                    value={currencyZar.format(data.totalCostZar)}
                    icon={<AttachMoneyIcon sx={{ color: '#fff' }} />}
                    color="#ed6c02"
                    subtitle="Projected this month"
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <MetricCard
                    title="Avg Profit Margin"
                    value={percentFormat(data.averageProfitMarginPercent)}
                    icon={<TrendingUpIcon sx={{ color: '#fff' }} />}
                    color={data.averageProfitMarginPercent >= 50 ? '#2e7d32' : data.averageProfitMarginPercent >= 35 ? '#ed6c02' : '#d32f2f'}
                    subtitle="Across all institutions"
                />
            </Grid>

            {/* Modules Card */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <MetricCard
                    title="Total Modules"
                    value={data.totalModules.toLocaleString()}
                    icon={<LibraryBooksIcon sx={{ color: '#fff' }} />}
                    color="#7b1fa2"
                    subtitle="Created in last 30 days"
                />
            </Grid>

            {/* Top 3 Most Active Institutions */}
            <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                <Paper sx={{ borderRadius: 3, p: 3, height: '100%' }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Top 3 Most Active Institutions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Ranked by module creation and submission activity over the last 30 days.
                    </Typography>
                    {data.top3MostActiveInstitutions.length === 0 ? (
                        <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                            No activity data available yet.
                        </Typography>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Institution</TableCell>
                                        <TableCell align="right">Users</TableCell>
                                        <TableCell align="right">Modules</TableCell>
                                        <TableCell align="right">Activity Score</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.top3MostActiveInstitutions.map((inst, idx) => (
                                        <TableRow key={inst.institutionId} hover>
                                            <TableCell>
                                                <Chip
                                                    label={idx + 1}
                                                    size="small"
                                                    color={idx === 0 ? 'primary' : 'default'}
                                                    variant={idx === 0 ? 'filled' : 'outlined'}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight={600}>{inst.name}</Typography>
                                            </TableCell>
                                            <TableCell align="right">{inst.userCount.toLocaleString()}</TableCell>
                                            <TableCell align="right">{inst.moduleCount.toLocaleString()}</TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={inst.activityScore.toLocaleString()}
                                                    size="small"
                                                    color="success"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Grid>

            {/* Profit Margin Buckets */}
            <Grid size={{ xs: 12 }}>
                <Paper sx={{ borderRadius: 3, p: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Institution Profit Margins
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Distribution of institutions by their current projected profit margin.
                    </Typography>
                    <Stack spacing={2.5}>
                        <MarginBucketBar
                            label="Below 35%"
                            count={data.profitMarginBuckets.below35}
                            total={bucketTotal}
                            color="#d32f2f"
                        />
                        <MarginBucketBar
                            label="35% – 75%"
                            count={data.profitMarginBuckets.between35And75}
                            total={bucketTotal}
                            color="#ed6c02"
                        />
                        <MarginBucketBar
                            label="Above 75%"
                            count={data.profitMarginBuckets.above75}
                            total={bucketTotal}
                            color="#2e7d32"
                        />
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    );
}
