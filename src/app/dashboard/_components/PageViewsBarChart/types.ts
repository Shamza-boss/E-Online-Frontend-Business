import { type GradePerfomanceDto } from '@/app/_lib/interfaces/types';

export type PageViewsBarChartProps = {
  title?: string;
  description?: string;
  yAxisLabel?: string;
  valueLabel?: string;
  total?: string;
  trend: 'success' | 'error' | 'default';
  average: string;
  months: string[];
  series: GradePerfomanceDto[];
  numberOfTrainees: number;
  isLoading: boolean;
}
