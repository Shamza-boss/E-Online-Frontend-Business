'use client';

import { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { PieChart } from '@mui/x-charts/PieChart';
import RoleHomeShell from '../RoleHomeShell';
import {
  dashboardChartColor,
  dashboardSeriesColors,
} from '../RoleHomeShell/chartTheme';
import InsightSummaryCard from '../InsightSummaryCard';
import DashboardDetailModal from '../DashboardDetailModal';
import {
  useTraineeHomeDashboard,
  useDashboardInsight,
} from '@/app/_lib/hooks/useDashboard';
import type { TraineeInsightId } from '@/app/_lib/types/dashboardInsights';
import {
  DESCRIPTION,
  DETAIL_LOAD_ERROR,
  INSIGHT_SUBTITLES,
  INSIGHT_TITLES,
  TITLE,
} from './constants';
import {
  buildWorkloadPie,
  clampGrade,
  formatRate,
  toPercent,
} from './utils';
import type { TraineeDashboardHomeProps } from './utils';
import TraineeInsightDetail from './details/TraineeInsightDetail';

const REMOTE: ReadonlySet<TraineeInsightId> = new Set(['activity']);

function shortDue(value: string | null | undefined): string {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

export default function TraineeDashboardHome({
  initialData,
}: TraineeDashboardHomeProps) {
  const theme = useTheme();
  const chartColor = dashboardChartColor(theme);
  const { data, isLoading } = useTraineeHomeDashboard(initialData);
  const [activeInsight, setActiveInsight] = useState<TraineeInsightId | null>(null);
  const needsRemote =
    activeInsight != null && REMOTE.has(activeInsight);
  const {
    data: remoteDetail,
    isLoading: detailLoading,
  } = useDashboardInsight('trainee', needsRemote ? activeInsight : null);
  const remoteFailed = needsRemote && !detailLoading && remoteDetail == null;

  const nextDue = data?.nextDue ?? [];
  const grade = clampGrade(data?.myAverageGrade);
  const submissionPct = toPercent(data?.mySubmissionRate);
  const workload = buildWorkloadPie(data);
  const overdueCount = data?.overdueCount ?? 0;
  const dueSoonCount = data?.dueSoonCount ?? 0;
  const sliceColors = dashboardSeriesColors(theme, workload.length);

  const open = (id: TraineeInsightId) => () => setActiveInsight(id);
  const close = () => setActiveInsight(null);

  return (
    <>
      <RoleHomeShell
        title={TITLE}
        description={DESCRIPTION}
        columns={2}
        heroes={[
          {
            label: 'Due soon',
            value: `${dueSoonCount}`,
            hint: 'Next 7 days',
            onOpen: open('nextDue'),
          },
          {
            label: 'Overdue',
            value: `${overdueCount}`,
            hint: overdueCount > 0 ? 'Handle these first' : 'You are clear',
            onOpen: open('workload'),
          },
          {
            label: 'Average grade',
            value: `${grade}`,
            hint: `Submission ${formatRate(data?.mySubmissionRate)}`,
            onOpen: open('progress'),
          },
        ]}
      >
        <InsightSummaryCard
          title={INSIGHT_TITLES.progress}
          value={grade}
          valueHint={`submit ${submissionPct}%`}
          onOpen={open('progress')}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <Gauge
              value={grade}
              startAngle={-110}
              endAngle={110}
              height={110}
              cornerRadius="50%"
              sx={{
                [`& .${gaugeClasses.valueText}`]: { fontSize: 0 },
                [`& .${gaugeClasses.valueArc}`]: { fill: chartColor },
                [`& .${gaugeClasses.referenceArc}`]: {
                  fill: theme.palette.action.hover,
                },
              }}
              text={() => ''}
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.workload}
          value={overdueCount + dueSoonCount}
          valueHint="open items"
          onOpen={open('workload')}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <PieChart
              height={110}
              series={[
                {
                  data: workload.map((item, index) => ({
                    id: item.id,
                    value: item.value,
                    color: sliceColors[index % sliceColors.length],
                  })),
                  innerRadius: 24,
                  outerRadius: 44,
                  paddingAngle: 3,
                  cornerRadius: 4,
                },
              ]}
              margin={{ top: 4, bottom: 4, left: 4, right: 4 }}
              hideLegend
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.nextDue}
          value={nextDue.length}
          valueHint="coming up"
          onOpen={open('nextDue')}
        >
          {isLoading ? <Skeleton variant="rounded" height="100%" /> : null}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.nextExam}
          value={data?.nextExamTitle ? shortDue(data?.nextExamScheduledAt) : '—'}
          valueHint={data?.nextExamTitle ?? 'None scheduled'}
          onOpen={open('nextExam')}
        >
          {isLoading ? <Skeleton variant="rounded" height="100%" /> : null}
        </InsightSummaryCard>
      </RoleHomeShell>

      <DashboardDetailModal
        open={activeInsight != null}
        onClose={close}
        title={activeInsight ? INSIGHT_TITLES[activeInsight] : ''}
        subtitle={activeInsight ? INSIGHT_SUBTITLES[activeInsight] : undefined}
        loading={needsRemote && detailLoading}
        error={remoteFailed ? DETAIL_LOAD_ERROR : null}
      >
        {activeInsight ? (
          <TraineeInsightDetail
            insight={activeInsight}
            detail={needsRemote ? remoteDetail : null}
            homeData={data}
          />
        ) : null}
      </DashboardDetailModal>
    </>
  );
}
