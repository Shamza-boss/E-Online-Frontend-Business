export type SubjectSeriesItem = {
  id: string;
  label: string;
  data: number[];
}

export type ActiveSubjectsChartProps = {
  labels: string[];
  series: SubjectSeriesItem[];
  isLoading?: boolean;
  title?: string;
  description?: string;
  yAxisLabel?: string;
  chipLabel?: string;
}

export type AreaGradientProps = {
  color: string;
  id: string;
}
