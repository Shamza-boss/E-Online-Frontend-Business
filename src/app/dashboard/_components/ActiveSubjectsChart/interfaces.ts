export interface SubjectSeriesItem {
  id: string;
  label: string;
  data: number[];
}

export interface ActiveSubjectsChartProps {
  labels: string[];
  series: SubjectSeriesItem[];
  isLoading?: boolean;
  title?: string;
  description?: string;
  yAxisLabel?: string;
  chipLabel?: string;
}

export interface AreaGradientProps {
  color: string;
  id: string;
}
