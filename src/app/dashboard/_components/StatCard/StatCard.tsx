import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';
import type { StatCardProps } from './interfaces';
import { LABEL_COLORS } from './constants';
import {
  getLast30DaysLabels,
  formatDisplayValue,
  calculateTrendValue,
  getTrendColors,
} from './utils';
import {
  StatCardRoot,
  CardColumnStack,
  CardRowStack,
  SparklineContainer,
  IntervalText,
  SkeletonValueBox,
  SkeletonChipBox,
  SkeletonIntervalBox,
  SkeletonChartBox,
  AreaGradient,
} from './elements';

export default function StatCard({
  title,
  value,
  interval,
  trend,
  data,
  loading,
}: StatCardProps) {
  const theme = useTheme();
  const last30DaysLabels = getLast30DaysLabels();
  const trendData = calculateTrendValue(data);
  const displayValue = formatDisplayValue(value);

  if (loading) {
    return (
      <StatCardRoot variant="outlined">
        <CardContent>
          <Typography component="h2" variant="subtitle2" gutterBottom>
            {title}
          </Typography>
          <CardColumnStack direction="column">
            <Stack>
              <CardRowStack direction="row">
                <SkeletonValueBox />
                <SkeletonChipBox />
              </CardRowStack>
              <SkeletonIntervalBox />
            </Stack>
            <SkeletonChartBox />
          </CardColumnStack>
        </CardContent>
      </StatCardRoot>
    );
  }

  const trendColors = getTrendColors(theme);
  const color = LABEL_COLORS[trend];
  const chartColor = trendColors[trend];
  const gradientId = `area-gradient-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <StatCardRoot variant="outlined">
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <CardColumnStack direction="column">
          <Stack>
            <CardRowStack direction="row">
              <Tooltip title={displayValue.actual} arrow>
                <Typography variant="h4" component="p">
                  {displayValue.display}
                </Typography>
              </Tooltip>
              <Tooltip title={trendData.tooltip} arrow>
                <Chip size="small" color={color} label={trendData.percentage} />
              </Tooltip>
            </CardRowStack>
            <IntervalText variant="caption">{interval}</IntervalText>
          </Stack>
          <SparklineContainer>
            <SparkLineChart
              color={chartColor}
              data={data}
              area
              showHighlight
              showTooltip
              xAxis={{
                scaleType: 'band',
                data: last30DaysLabels,
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#${gradientId})`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={gradientId} />
            </SparkLineChart>
          </SparklineContainer>
        </CardColumnStack>
      </CardContent>
    </StatCardRoot>
  );
}
