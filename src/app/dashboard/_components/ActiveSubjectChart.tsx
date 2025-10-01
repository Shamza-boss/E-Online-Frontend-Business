import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

interface ActiveSubjectsChartProps {
  labels: string[];
  series: {
    id: string;
    label: string;
    data: number[];
  }[];
  isLoading?: boolean;
}

export default function ActiveSubjectsChart({
  labels,
  series,
  isLoading = false,
}: ActiveSubjectsChartProps) {
  const theme = useTheme();

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

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
            Most active courses
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
                  width: 100,
                  height: 24,
                  backgroundColor: theme.palette.grey[300],
                  borderRadius: 12,
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            </Stack>
            <Stack
              sx={{
                width: '60%',
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
          Most active courses
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Typography variant="h4" component="p">
              {series.reduce(
                (sum, s) => sum + (s.data?.reduce((a, b) => a + b, 0) || 0),
                0
              )}
            </Typography>
            <Chip size="small" color="success" label="Last 30 days" />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Daily module submissions by course in the last 30 days
          </Typography>
        </Stack>

        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data: labels,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
            },
          ]}
          series={series.map((s, idx) => ({
            id: s.id,
            label: s.label,
            data: s.data,
            showMark: false,
            curve: 'linear',
            stack: 'total',
            stackOrder: 'ascending',
            area: true,
          }))}
          height={575}
          margin={{ left: -40, right: 0, top: 0, bottom: 0 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-0': { fill: "url('#subject0')" },
            '& .MuiAreaElement-series-1': { fill: "url('#subject1')" },
            '& .MuiAreaElement-series-2': { fill: "url('#subject2')" },
          }}
        >
          {series.map((_, idx) => (
            <AreaGradient
              key={`grad-${idx}`}
              color={colorPalette[idx % colorPalette.length]}
              id={`subject${idx}`}
            />
          ))}
        </LineChart>
      </CardContent>
    </Card>
  );
}
