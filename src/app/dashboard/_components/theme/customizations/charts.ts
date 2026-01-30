import { Theme } from '@mui/material/styles';
import { axisClasses, legendClasses, chartsGridClasses } from '@mui/x-charts';
import type { ChartsComponents } from '@mui/x-charts/themeAugmentation';
import { gray } from '../../../../_lib/components/shared-theme/themePrimitives';

export const chartsCustomizations: ChartsComponents<Theme> = {
  MuiChartsAxis: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .${axisClasses.line}`]: {
          stroke: gray[300],
        },
        [`& .${axisClasses.tick}`]: { stroke: gray[300] },
        [`& .${axisClasses.tickLabel}`]: {
          fill: gray[500],
          fontWeight: 500,
        },
        ...theme.applyStyles('dark', {
          [`& .${axisClasses.line}`]: {
            stroke: gray[700],
          },
          [`& .${axisClasses.tick}`]: { stroke: gray[700] },
          [`& .${axisClasses.tickLabel}`]: {
            fill: gray[300],
            fontWeight: 500,
          },
        }),
      }),
    },
  },
  MuiChartsTooltip: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiChartsTooltip-paper': {
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[16],
          borderRadius: theme.shape.borderRadius,
          overflow: 'hidden',
          backdropFilter: 'blur(12px)',
        },
      }),
      mark: ({ theme }) => ({
        ry: 6,
        boxShadow: 'none',
        border: `1px solid ${theme.palette.divider}`,
      }),
      table: ({ theme }) => ({
        border: 'none',
        borderRadius: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        ...theme.applyStyles('dark', {
          background: 'rgba(0, 0, 0, 0.85)',
        }),
      }),
      row: ({ theme }) => ({
        '&:first-of-type': {
          background: 'rgba(0, 0, 0, 0.03)',
          ...theme.applyStyles('dark', {
            background: 'rgba(255, 255, 255, 0.08)',
          }),
        },
      }),
      cell: ({ theme }) => ({
        border: 'none',
        padding: theme.spacing(0.75, 1.5),
      }),
    },
  },
  MuiChartsLegend: {
    styleOverrides: {
      root: {
        [`& .${legendClasses.mark}`]: {
          ry: 6,
        },
      },
    },
  },
  MuiChartsGrid: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .${chartsGridClasses.line}`]: {
          stroke: gray[200],
          strokeDasharray: '4 2',
          strokeWidth: 0.8,
        },
        ...theme.applyStyles('dark', {
          [`& .${chartsGridClasses.line}`]: {
            stroke: gray[700],
            strokeDasharray: '4 2',
            strokeWidth: 0.8,
          },
        }),
      }),
    },
  },
};
