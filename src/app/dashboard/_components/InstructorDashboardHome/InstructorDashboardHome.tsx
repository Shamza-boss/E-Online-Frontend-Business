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
  useInstructorHomeDashboard,
  useDashboardInsight,
} from '@/app/_lib/hooks/useDashboard';
import type { InstructorInsightId } from '@/app/_lib/types/dashboardInsights';
import {
  DESCRIPTION,
  DETAIL_LOAD_ERROR,
  INSIGHT_SUBTITLES,
  INSIGHT_TITLES,
  TITLE,
} from './constants';
import { buildWorkloadSeries, formatRate, toPercent } from './utils';
import type { InstructorDashboardHomeProps } from './utils';
import InstructorInsightDetail from './details/InstructorInsightDetail';

/** Workload queue is the only piece missing from the home payload. */
const REMOTE: ReadonlySet<InstructorInsightId> = new Set(['workload']);

export default function InstructorDashboardHome({
  initialData,
}: InstructorDashboardHomeProps) {
  const theme = useTheme();
  const chartColor = dashboardChartColor(theme);
  const { data, isLoading } = useInstructorHomeDashboard(initialData);
  const [activeInsight, setActiveInsight] = useState<InstructorInsightId | null>(
    null,
  );
  const needsRemote =
    activeInsight != null && REMOTE.has(activeInsight);
  const {
    data: remoteDetail,
    isLoading: detailLoading,
  } = useDashboardInsight('instructor', needsRemote ? activeInsight : null);
  const remoteFailed = needsRemote && !detailLoading && remoteDetail == null;

  const atRisk = data?.atRiskTrainees ?? [];
  const workload = buildWorkloadSeries(data);
  const submissionPct = toPercent(data?.mySubmissionRate);
  const pendingToGrade = data?.pendingToGradeCount ?? 0;
  const sliceColors = dashboardSeriesColors(theme, workload.length);

  const open = (id: InstructorInsightId) => () => setActiveInsight(id);
  const close = () => setActiveInsight(null);

  return (
    <>
      <RoleHomeShell
        title={TITLE}
        description={DESCRIPTION}
        columns={3}
        heroes={[
          {
            label: 'To grade',
            value: `${pendingToGrade}`,
            hint: 'Submitted, waiting on you',
            onOpen: open('workload'),
          },
          {
            label: 'Submission rate',
            value: formatRate(data?.mySubmissionRate),
            hint: 'Across your classes',
            onOpen: open('submission'),
          },
          {
            label: 'At risk',
            value: `${atRisk.length}`,
            hint: atRisk.length ? 'Tap to review' : 'Looking healthy',
            onOpen: open('atRisk'),
          },
        ]}
      >
        <InsightSummaryCard
          title={INSIGHT_TITLES.submission}
          value={`${submissionPct}%`}
          valueHint="class submission"
          onOpen={open('submission')}
        >
          {isLoading ? (
            <Skeleton variant="circular" width={100} height={100} sx={{ mx: 'auto' }} />
          ) : (
            <Gauge
              value={submissionPct}
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
          value={pendingToGrade}
          valueHint="waiting to grade"
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
          title={INSIGHT_TITLES.atRisk}
          value={atRisk.length}
          valueHint="trainees"
          onOpen={open('atRisk')}
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
          <InstructorInsightDetail
            insight={activeInsight}
            detail={needsRemote ? remoteDetail : null}
            homeData={data}
          />
        ) : null}
      </DashboardDetailModal>
    </>
  );
}
