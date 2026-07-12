export type StatCardProps = {
  title: string;
  value: string;
  interval: string;
  trend: 'up' | 'down' | 'neutral';
  data: number[];
  loading: boolean;
};

export type TrendDirection = StatCardProps['trend'];

export type DisplayValue = {
  display: string;
  actual: string;
}

export type TrendValue = {
  percentage: string;
  tooltip: string;
}

export type AreaGradientProps = {
  color: string;
  id: string;
}
