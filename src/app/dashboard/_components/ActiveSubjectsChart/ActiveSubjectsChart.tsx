import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import type { ActiveSubjectsChartProps } from './types';
import {
  CHART_HEIGHT,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_Y_AXIS_LABEL,
  DEFAULT_CHIP_LABEL,
  AREA_GRADIENT_ID_PREFIX,
  TICK_INTERVAL_STEP,
} from './constants';
import {
  normalizeSubjectSeries,
  computeChartMaxValue,
  computeYAxisTicks,
  computeTotalSubmissions,
  AreaGradient,
} from './utils';
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
import { ChartScrollArea } from '../RoleHomeShell/ChartPanel';

export default function ActiveSubjectsChart({
  labels,
  series,
  isLoading = false,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  yAxisLabel = DEFAULT_Y_AXIS_LABEL,
  chipLabel = DEFAULT_CHIP_LABEL,
}: ActiveSubjectsChartProps) {
  const theme = useTheme();

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  const normalizedSeries = React.useMemo(
    () => normalizeSubjectSeries(series),
    [series],
  );

  const chartMaxValue = React.useMemo(
    () => computeChartMaxValue(normalizedSeries),
    [normalizedSeries],
  );

  const yAxisTicks = React.useMemo(
    () => computeYAxisTicks(chartMaxValue),
    [chartMaxValue],
  );

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

  const areaFillStyles = Object.fromEntries(
    normalizedSeries.map((_, idx) => [
      `& .MuiAreaElement-series-${idx}`,
      { fill: `url('#${AREA_GRADIENT_ID_PREFIX}${idx}')` },
    ]),
  );

  return (
    <ChartCard variant="outlined">
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <HeaderStack>
          <ChipRow direction="row">
            <Typography variant="h4" component="p">
              {computeTotalSubmissions(normalizedSeries)}
            </Typography>
            <Chip size="small" color="success" label={chipLabel} />
          </ChipRow>
          <CaptionText variant="caption">{description}</CaptionText>
        </HeaderStack>

        <ChartScrollArea minWidthPx={720}>
          <LineChart
            colors={colorPalette}
            xAxis={[
              {
                scaleType: 'point',
                data: labels,
                tickInterval: (_index, i) => (i + 1) % TICK_INTERVAL_STEP === 0,
              },
            ]}
            yAxis={[
              {
                label: yAxisLabel,
                min: 0,
                max: chartMaxValue,
                tickInterval: yAxisTicks,
                valueFormatter: (value: number) => `${value}`,
              },
            ]}
            series={normalizedSeries.map((s) => ({
              id: s.id,
              label: s.label,
              data: s.data,
              showMark: false,
              curve: 'linear' as const,
              stack: 'total',
              stackOrder: 'ascending' as const,
              area: true,
            }))}
            height={CHART_HEIGHT}
            grid={{ horizontal: true }}
            sx={areaFillStyles}
          >
            {normalizedSeries.map((_, idx) => {
              const color =
                colorPalette[idx % colorPalette.length] ??
                colorPalette[0] ??
                '#1976d2';
              return (
                <AreaGradient
                  key={`grad-${idx}`}
                  color={color}
                  id={`${AREA_GRADIENT_ID_PREFIX}${idx}`}
                />
              );
            })}
          </LineChart>
        </ChartScrollArea>
      </CardContent>
    </ChartCard>
  );
}
