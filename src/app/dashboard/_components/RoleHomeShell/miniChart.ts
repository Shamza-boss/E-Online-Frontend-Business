import { axisClasses } from '@mui/x-charts/ChartsAxis';

/** Compact summary charts: hide axes so tiles stay calm. */
export const miniChartSx = {
  [`& .${axisClasses.root}`]: { display: 'none' },
  [`& .${axisClasses.line}`]: { display: 'none' },
} as const;

export const miniChartMargin = { left: 4, right: 4, top: 8, bottom: 4 } as const;
