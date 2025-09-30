import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';

export type StatCardProps = {
  title: string;
  value: string;
  interval: string;
  trend: 'up' | 'down' | 'neutral';
  data: number[];
  loading: boolean;
};

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

// � Format large numbers with abbreviated units (K, M, B)
function formatDisplayValue(value: string): {
  display: string;
  actual: string;
} {
  // Try to parse as number, if it fails, return as-is
  const numValue = parseFloat(value.replace(/[^0-9.-]/g, ''));

  if (isNaN(numValue)) {
    return { display: value, actual: value };
  }

  const absValue = Math.abs(numValue);
  let display: string;

  if (absValue >= 1000000000) {
    display = `${(numValue / 1000000000).toFixed(1)}B`;
  } else if (absValue >= 1000000) {
    display = `${(numValue / 1000000).toFixed(1)}M`;
  } else if (absValue >= 1000) {
    display = `${(numValue / 1000).toFixed(1)}K`;
  } else {
    display = value;
  }

  return { display, actual: value };
}

// �🔢 Calculate trend percentage from data with decimal precision
function calculateTrendValue(data: number[]): {
  percentage: string;
  tooltip: string;
} {
  if (data.length < 2) {
    return {
      percentage: '0.0%',
      tooltip:
        'Insufficient data to calculate trend (need at least 2 data points)',
    };
  }

  const midpoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midpoint);
  const secondHalf = data.slice(midpoint);

  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  if (firstAvg === 0) {
    return {
      percentage: '0.0%',
      tooltip: `Cannot calculate trend. More data needed.`,
    };
  }

  const percentage = ((secondAvg - firstAvg) / firstAvg) * 100;
  const formatted = `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;

  const tooltip = `Trend calculation: Comparing first half average (${firstAvg.toFixed(2)}) vs second half average (${secondAvg.toFixed(2)}). Change: ${formatted}`;

  return { percentage: formatted, tooltip };
}

export default function StatCard({
  title,
  value,
  interval,
  trend,
  data,
  loading,
}: StatCardProps) {
  const theme = useTheme();
  const daysInWeek = getDaysInMonth(4, 2024);
  const trendData = calculateTrendValue(data);
  const displayValue = formatDisplayValue(value);

  // Show loading skeleton while data is loading
  if (loading) {
    return (
      <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
        <CardContent>
          <Typography component="h2" variant="subtitle2" gutterBottom>
            {title}
          </Typography>
          <Stack
            direction="column"
            sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
          >
            <Stack sx={{ justifyContent: 'space-between' }}>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box
                  sx={{
                    width: '60%',
                    height: 32,
                    backgroundColor: theme.palette.grey[300],
                    borderRadius: 1,
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
                <Box
                  sx={{
                    width: 60,
                    height: 24,
                    backgroundColor: theme.palette.grey[300],
                    borderRadius: 12,
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              </Stack>
              <Box
                sx={{
                  width: '40%',
                  height: 16,
                  backgroundColor: theme.palette.grey[300],
                  borderRadius: 1,
                  mt: 1,
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            </Stack>
            <Box
              sx={{
                width: '100%',
                height: 50,
                backgroundColor: theme.palette.grey[300],
                borderRadius: 1,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const trendColors = {
    up:
      theme.palette.mode === 'light'
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === 'light'
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === 'light'
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const labelColors = {
    up: 'success' as const,
    down: 'error' as const,
    neutral: 'default' as const,
  };

  const color = labelColors[trend];
  const chartColor = trendColors[trend];

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        flexGrow: 1,
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
        <Stack
          direction="column"
          sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
        >
          <Stack sx={{ justifyContent: 'space-between' }}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Tooltip title={displayValue.actual} arrow>
                <Typography variant="h4" component="p">
                  {displayValue.display}
                </Typography>
              </Tooltip>
              <Tooltip title={trendData.tooltip} arrow>
                <Chip size="small" color={color} label={trendData.percentage} />
              </Tooltip>
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {interval}
            </Typography>
          </Stack>
          <Box sx={{ width: '100%', height: 50 }}>
            <SparkLineChart
              color={chartColor}
              data={data}
              area
              showHighlight
              showTooltip
              xAxis={{
                scaleType: 'band',
                data: daysInWeek,
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${title.replace(/\s+/g, '-').toLowerCase()})`,
                },
              }}
            >
              <AreaGradient
                color={chartColor}
                id={`area-gradient-${title.replace(/\s+/g, '-').toLowerCase()}`}
              />
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
