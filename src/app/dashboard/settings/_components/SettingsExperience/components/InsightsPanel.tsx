'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { LineChart, BarChart } from '@mui/x-charts';
import type { SettingsStatsDto, StatsGraphDto } from '@/app/_lib/interfaces/types';
import type { RoleTheme } from '../types';
import {
  formatMetricKey,
  formatMetricValue,
  getChartPalette,
} from '../utils';

type InsightsPanelProps = {
  stats: SettingsStatsDto;
  roleTheme: RoleTheme;
  roleLabel: string;
}

export default function InsightsPanel({ stats, roleTheme, roleLabel }: InsightsPanelProps) {
  const kpiEntries = Object.entries(stats?.kpis ?? {});
  const extraEntries = Object.entries(stats?.extra ?? {});
  const graphs = stats?.graphs ?? [];

  return (
    <Stack spacing={3} sx={{ width: '100%', minWidth: 0 }}>
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          background: roleTheme.gradient,
          borderColor: roleTheme.border,
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
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
          {kpiEntries.map(([key, value]) => (
            <Paper
              key={key}
              elevation={0}
              variant="outlined"
              sx={{
                flex: { sm: '1 1 220px' },
                width: { xs: '100%', sm: 'auto' },
                minWidth: { sm: 220 },
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                borderColor: roleTheme.border,
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
        <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
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
        <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Graphs will appear here once we have enough data to visualize trends.
          </Typography>
        </Paper>
      )}

      {extraEntries.length ? (
        <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
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

function StatsGraphCard({
  graph,
  roleTheme,
}: {
  graph: StatsGraphDto;
  roleTheme: RoleTheme;
}) {
  const series = graph?.series ?? [];
  const hasData = series.length && series.some((serie) => serie.values.length);
  const isTrend = graph.id.toLowerCase().includes('trend') || graph.x.length > 8;
  const theme = useTheme();
  const palette = React.useMemo(
    () => getChartPalette(roleTheme.accent, theme),
    [roleTheme.accent, theme],
  );

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, width: '100%', minWidth: 0 }}>
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
          <Box sx={{ width: '100%', minWidth: 0, overflowX: 'auto' }}>
            {isTrend ? (
              <LineChart
                height={280}
                width={undefined}
                sx={{ width: '100%', minWidth: 280 }}
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
                height={280}
                width={undefined}
                sx={{ width: '100%', minWidth: 280 }}
                xAxis={[{ scaleType: 'band', data: graph.x }]}
                series={series.map((serie, idx) => ({
                  data: serie.values,
                  label: serie.name,
                  color: palette[idx % palette.length],
                }))}
                margin={{ left: 30, right: 10, top: 20, bottom: 40 }}
              />
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Not enough data yet to render this visualization.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
