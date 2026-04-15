import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import type { PageViewsBarChartProps } from './interfaces';
import {
  CHART_MAX_VALUE,
  CHART_HEIGHT,
  CATEGORY_GAP_RATIO,
  BORDER_RADIUS,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_Y_AXIS_LABEL,
  DEFAULT_VALUE_LABEL,
} from './constants';
import { normalizeSeries, computePercentageSeries, computeYAxisTicks } from './utils';
import {
  ChartCard,
  ChartCardLoading,
  HeaderStack,
  ChipRow,
  CaptionText,
  SkeletonTotalBox,
  SkeletonChipBox,
  SkeletonDescriptionBox,
  SkeletonChartArea,
} from './elements';

export default function PageViewsBarChart({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  yAxisLabel = DEFAULT_Y_AXIS_LABEL,
  valueLabel = DEFAULT_VALUE_LABEL,
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

  const normalizedSeries = React.useMemo(
    () => normalizeSeries(series),
    [series],
  );

  const percentageSeries = React.useMemo(
    () => computePercentageSeries(normalizedSeries, numberOfTrainees),
    [normalizedSeries, numberOfTrainees],
  );

  const yAxisTicks = React.useMemo(() => computeYAxisTicks(), []);

  if (isLoading) {
    return (
      <ChartCardLoading variant="outlined">
        <CardContent>
          <Typography component="h2" variant="subtitle2" gutterBottom>
            {title}
          </Typography>
          <HeaderStack>
            <ChipRow direction="row">
              <SkeletonTotalBox />
              <SkeletonChipBox />
            </ChipRow>
            <SkeletonDescriptionBox />
          </HeaderStack>
          <SkeletonChartArea />
        </CardContent>
      </ChartCardLoading>
    );
  }

  return (
    <ChartCard variant="outlined">
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>

        <HeaderStack>
          <ChipRow direction="row">
            <Typography variant="h4" component="p">
              {total}
            </Typography>
            <Chip size="small" color={trend} label={average} />
          </ChipRow>
          <CaptionText variant="caption">{description}</CaptionText>
        </HeaderStack>

        <BarChart
          borderRadius={BORDER_RADIUS}
          colors={colorPalette}
          xAxis={[
            {
              categoryGapRatio: CATEGORY_GAP_RATIO,
              data: months,
            },
          ]}
          yAxis={[
            {
              label: yAxisLabel,
              min: 0,
              max: CHART_MAX_VALUE,
              tickInterval: yAxisTicks,
              valueFormatter: (value: number): string => `${value}%`,
            },
          ]}
          series={percentageSeries.map((s, index) => ({
            id: `series-${index}` as const,
            label: s.label,
            data: s.data,
            stack: 'total',
            valueFormatter: (value: number | null, context) => {
              if (value == null) {
                return null;
              }

              const dataIndex = context?.dataIndex ?? 0;
              const rawValue = normalizedSeries[index]?.data?.[dataIndex] ?? 0;

              return `${rawValue} ${valueLabel} (${value.toFixed(1)}%)`;
            },
          }))}
          height={CHART_HEIGHT}
          grid={{ horizontal: true }}
        />
      </CardContent>
    </ChartCard>
  );
}
