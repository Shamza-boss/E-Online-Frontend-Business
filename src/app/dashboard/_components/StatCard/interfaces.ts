export type StatCardProps = {
  title: string;
  value: string;
  interval: string;
  trend: 'up' | 'down' | 'neutral';
  data: number[];
  loading: boolean;
};

export type TrendDirection = StatCardProps['trend'];

export interface DisplayValue {
  display: string;
  actual: string;
}

export interface TrendValue {
  percentage: string;
  tooltip: string;
}

export interface AreaGradientProps {
  color: string;
  id: string;
}
