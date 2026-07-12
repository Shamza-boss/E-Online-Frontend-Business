import type { Theme } from '@mui/material/styles';
import type { DisplayValue, TrendValue } from './types';

export function getDaysInMonth(month: number, year: number): string[] {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  const daysInMonth = date.getDate();
  const days: string[] = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

export function getLast30DaysLabels(): string[] {
  const labels: string[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    labels.push(`${monthName} ${day}`);
  }

  return labels;
}

export function formatDisplayValue(value: string): DisplayValue {
  const numValue = parseFloat(value.replace(/[^0-9.-]/g, ''));

  if (isNaN(numValue)) {
    return { display: value, actual: value };
  }

  const absValue = Math.abs(numValue);
  let display: string;

  if (absValue >= 1_000_000_000) {
    display = `${(numValue / 1_000_000_000).toFixed(1)}B`;
  } else if (absValue >= 1_000_000) {
    display = `${(numValue / 1_000_000).toFixed(1)}M`;
  } else if (absValue >= 1_000) {
    display = `${(numValue / 1_000).toFixed(1)}K`;
  } else {
    display = value;
  }

  return { display, actual: value };
}

export function calculateTrendValue(data: number[]): TrendValue {
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
      tooltip: 'Cannot calculate trend. More data needed.',
    };
  }

  const percentage = ((secondAvg - firstAvg) / firstAvg) * 100;
  const formatted = `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;

  const tooltip = `Trend calculation: Comparing first half average (${firstAvg.toFixed(2)}) vs second half average (${secondAvg.toFixed(2)}). Change: ${formatted}`;

  return { percentage: formatted, tooltip };
}

export function getTrendColors(theme: Theme) {
  return {
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
}
