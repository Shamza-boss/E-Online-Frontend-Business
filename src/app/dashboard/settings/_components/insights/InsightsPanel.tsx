'use client';

import React from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { useTheme, type Theme } from '@mui/material/styles';
import { LineChart, BarChart } from '@mui/x-charts';
import type { SettingsStatsDto, StatsGraphDto } from '@/app/_lib/interfaces/types';
import type { RoleTheme } from '../types';

interface InsightsPanelProps {
    stats: SettingsStatsDto;
    roleTheme: RoleTheme;
    roleLabel: string;
}

const compactMetricNumber = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
});

export default function InsightsPanel({ stats, roleTheme, roleLabel }: InsightsPanelProps) {
    const kpiEntries = Object.entries(stats?.kpis ?? {});
    const extraEntries = Object.entries(stats?.extra ?? {});
    const graphs = stats?.graphs ?? [];

    return (
        <Stack spacing={4}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    background: roleTheme.gradient,
                    border: `1px solid ${roleTheme.border}`,
                }}
            >
                <Stack spacing={1.5}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                        <Typography variant="h5" fontWeight={700} flex={1}>
                            Role insights for {roleLabel}
                        </Typography>
                        {stats.rating ? (
                            <Chip
                                label={stats.rating}
                                color={roleTheme.chipColor}
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                            />
                        ) : undefined}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                        {stats.explanation}
                    </Typography>
                </Stack>
            </Paper>

            {kpiEntries.length ? (
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap">
                    {kpiEntries.map(([key, value]) => (
                        <Paper
                            key={key}
                            elevation={0}
                            sx={{
                                flex: 1,
                                minWidth: 220,
                                p: 3,
                                borderRadius: 4,
                                border: `1px solid ${roleTheme.border}`,
                                backgroundColor: roleTheme.surface,
                            }}
                        >
                            <Typography variant="caption" textTransform="uppercase" color="text.secondary">
                                {formatMetricKey(key)}
                            </Typography>
                            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                                {formatMetricValue(key, value)}
                            </Typography>
                        </Paper>
                    ))}
                </Stack>
            ) : (
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        No KPIs yet for this role. Complete more activity to unlock insights.
                    </Typography>
                </Paper>
            )}

            {graphs.length ? (
                <Stack spacing={3}>
                    {graphs.map((graph) => (
                        <StatsGraphCard key={graph.id} graph={graph} roleTheme={roleTheme} />
                    ))}
                </Stack>
            ) : (
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        Graphs will appear here once we have enough data to visualize trends.
                    </Typography>
                </Paper>
            )}

            {extraEntries.length ? (
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                        Extra details
                    </Typography>
                    <Stack spacing={1.5}>
                        {extraEntries.map(([key, value]) => (
                            <Stack key={key} direction="row" spacing={1} justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                    {formatMetricKey(key)}
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {String(value)}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Paper>
            ) : null}
        </Stack>
    );
}

function StatsGraphCard({ graph, roleTheme }: { graph: StatsGraphDto; roleTheme: RoleTheme }) {
    const series = graph?.series ?? [];
    const hasData = series.length && series.some((serie) => serie.values.length);
    const isTrend = graph.id.toLowerCase().includes('trend') || graph.x.length > 8;
    const theme = useTheme();
    const palette = React.useMemo(() => getChartPalette(roleTheme.accent, theme), [roleTheme.accent, theme]);

    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
            <Stack spacing={1.5}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        {graph.title}
                    </Typography>
                    {graph.description ? (
                        <Typography variant="body2" color="text.secondary">
                            {graph.description}
                        </Typography>
                    ) : undefined}
                </Box>
                {hasData ? (
                    isTrend ? (
                        <LineChart
                            height={320}
                            xAxis={[{ data: graph.x, scaleType: 'point' }]}
                            series={series.map((serie, idx) => ({
                                data: serie.values,
                                label: serie.name,
                                color: palette[idx % palette.length],
                                area: true,
                            }))}
                            margin={{ left: 40, right: 20, top: 20, bottom: 40 }}
                        />
                    ) : (
                        <BarChart
                            height={320}
                            xAxis={[{ scaleType: 'band', data: graph.x }]}
                            series={series.map((serie, idx) => ({
                                data: serie.values,
                                label: serie.name,
                                color: palette[idx % palette.length],
                            }))}
                            margin={{ left: 30, right: 10, top: 20, bottom: 40 }}
                        />
                    )
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Not enough data yet to render this visualization.
                    </Typography>
                )}
            </Stack>
        </Paper>
    );
}

function formatMetricKey(key: string) {
    return key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
        .trim();
}

function formatMetricValue(key: string, value: number) {
    if (Number.isNaN(value)) return '—';
    const percentLike = /(percent|rate|ratio|grade|score)/i;
    if (percentLike.test(key)) {
        return `${value.toFixed(2)}%`;
    }
    if (Math.abs(value) >= 1000) {
        return compactMetricNumber.format(value);
    }
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

function getChartPalette(accent: string, theme: Theme) {
    return [
        accent,
        theme.palette.text.secondary,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
    ];
}
