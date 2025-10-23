import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { GradePerfomanceDto } from '@/app/_lib/interfaces/types';

type PageViewsBarChartProps = {
  title?: string;
  total?: string;
  trend: 'success' | 'error' | 'default';
  average: string; // e.g., '+0%'
  months: string[]; // x-axis: e.g. ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
  series: GradePerfomanceDto[];
  numberOfTrainees: number;
  isLoading: boolean; // Optional loading state
};

export default function PageViewsBarChart({
  title = 'Trainee Performance Distribution',
  total = '',
  trend,
  average,
  months,
  series,
  numberOfTrainees,
  isLoading,
}: PageViewsBarChartProps) {
  const theme = useTheme();

  const colorPalette = [
    theme.palette.error.dark,
    theme.palette.primary.main,
    theme.palette.success.dark,
  ];

  const chartMaxValue = React.useMemo(() => {
    const flattenedSeries = series.flatMap((s) => s.data ?? []);
    const maxSeriesValue = flattenedSeries.length
      ? Math.max(...flattenedSeries)
      : 0;
    return Math.max(numberOfTrainees ?? 0, maxSeriesValue);
  }, [numberOfTrainees, series]);

  // Generate evenly spaced integer ticks so rounded labels remain unique.
  const yAxisTicks = React.useMemo(() => {
    if (!Number.isFinite(chartMaxValue) || chartMaxValue <= 0) {
      return [0];
    }

    const desiredTickCount = Math.min(chartMaxValue, 6);
    const step = Math.max(1, Math.ceil(chartMaxValue / desiredTickCount));
    const ticks: number[] = [0];

    for (let value = step; value < chartMaxValue; value += step) {
      ticks.push(value);
    }

    if (ticks[ticks.length - 1] !== chartMaxValue) {
      ticks.push(chartMaxValue);
    }

    return ticks;
  }, [chartMaxValue]);

  // Show loading skeleton while data is loading
  if (isLoading) {
    return (
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          '@keyframes pulse': {
            '0%, 100%': {
              opacity: 1,
            },
            '50%': {
              opacity: 0.5,
            },
          },
        }}
      >
        <CardContent>
          <Typography component="h2" variant="subtitle2" gutterBottom>
            {title}
          </Typography>

          <Stack sx={{ justifyContent: 'space-between' }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <Stack
                sx={{
                  width: 80,
                  height: 32,
                  backgroundColor: theme.palette.grey[300],
                  borderRadius: 1,
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <Stack
                sx={{
                  width: 60,
                  height: 24,
                  backgroundColor: theme.palette.grey[300],
                  borderRadius: 12,
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            </Stack>
            <Stack
              sx={{
                width: '70%',
                height: 16,
                backgroundColor: theme.palette.grey[300],
                borderRadius: 1,
                mt: 1,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          </Stack>

          <Stack
            sx={{
              width: '100%',
              height: 250,
              backgroundColor: theme.palette.grey[300],
              borderRadius: 1,
              mt: 2,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>

        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Typography variant="h4" component="p">
              {total}
            </Typography>
            <Chip size="small" color={trend} label={average} />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Breakdown of average trainee performance by grade range in the last
            6 months
          </Typography>
        </Stack>

        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band' as const,
              categoryGapRatio: 0.5,
              data: months,
            },
          ]}
          yAxis={[
            {
              label: 'Number of Trainees (each month)',
              min: 0,
              max: chartMaxValue,
              tickInterval: yAxisTicks,
              valueFormatter: (value: number): string => `${value}`,
            },
          ]}
          series={series.map((s, index) => ({
            id: `series-${index}` as const,
            label: s.label,
            data: s.data,
            stack: 'A' as const,
          }))}
          height={550}
          grid={{ horizontal: true }}
        />
      </CardContent>
    </Card>
  );
}
