'use client';

import { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import RoleHomeShell from '../RoleHomeShell';
import { miniChartMargin, miniChartSx } from '../RoleHomeShell/miniChart';
import {
  dashboardChartColor,
  dashboardCompareColors,
  seriesAverage,
  seriesLatest,
  seriesTotal,
} from '../RoleHomeShell/chartTheme';
import InsightSummaryCard from '../InsightSummaryCard';
import DashboardDetailModal from '../DashboardDetailModal';
import {
  useInstitutionDashboard,
  useDashboardInsight,
} from '@/app/_lib/hooks/useDashboard';
import type { AdminInsightId } from '@/app/_lib/types/dashboardInsights';
import {
  ADMIN_DASHBOARD_DESCRIPTION,
  ADMIN_DASHBOARD_TITLE,
  ADMIN_REMOTE_INSIGHTS,
  DETAIL_LOAD_ERROR,
  INSIGHT_SUBTITLES,
  INSIGHT_TITLES,
} from './constants';
import {
  buildEngagementRadar,
  buildModuleActivityBars,
  buildPresenceBars,
  formatPercent,
  getRecentModules,
  averageModuleSubmissionRate,
  totalModuleSubmissions,
} from './utils';
import type { AdminDashboardHomeProps } from './utils';
import AdminInsightDetail from './details/AdminInsightDetail';

export default function AdminDashboardHome({
  initialData,
}: AdminDashboardHomeProps) {
  const theme = useTheme();
  const chartColor = dashboardChartColor(theme);
  const compare = dashboardCompareColors(theme);
  const { data, isLoading } = useInstitutionDashboard(initialData);
  const [activeInsight, setActiveInsight] = useState<AdminInsightId | null>(null);

  const needsRemote =
    activeInsight != null && ADMIN_REMOTE_INSIGHTS.has(activeInsight);
  const { data: remoteDetail, isLoading: detailLoading } = useDashboardInsight(
    'admin',
    needsRemote ? activeInsight : null,
  );

  const inactive = data?.inactiveUsers ?? [];
  const presence = buildPresenceBars(data);
  const engagement = buildEngagementRadar(data);
  const contentSpark = data?.notesCreated?.dataPoints ?? [0];
  const subjectsSpark =
    data?.mostActiveSubjects?.series?.[0]?.data ??
    data?.homeworkCreated?.dataPoints ??
    [0];
  // Prefer “Above 75%” band for the card spark (order: under / mid / over).
  const gradesSpark =
    data?.gradePerformance?.[2]?.data ??
    data?.gradePerformance?.[0]?.data ??
    [0];
  const recentModules = getRecentModules(data);
  const modulesCount = recentModules.length;
  const modulesAvgRate = averageModuleSubmissionRate(recentModules);
  const modulesSubmissions = totalModuleSubmissions(recentModules);
  const moduleBars = buildModuleActivityBars(recentModules, 5);
  const remoteFailed =
    needsRemote && !detailLoading && remoteDetail == null;

  const open = (id: AdminInsightId) => () => setActiveInsight(id);
  const close = () => setActiveInsight(null);

  return (
    <>
      <RoleHomeShell
        title={ADMIN_DASHBOARD_TITLE}
        description={ADMIN_DASHBOARD_DESCRIPTION}
        heroes={[
          {
            label: 'People',
            value: `${(data?.teachers?.total ?? 0) + (data?.students?.total ?? 0)}`,
            hint: `${data?.teachers?.total ?? 0} instructors · ${data?.students?.total ?? 0} trainees`,
            onOpen: open('presence'),
          },
          {
            label: 'Follow-ups',
            value: `${inactive.length}`,
            hint: inactive.length ? 'Tap to review' : 'All clear',
            onOpen: open('followUps'),
          },
        ]}
      >
        <InsightSummaryCard
          title={INSIGHT_TITLES.presence}
          value={data?.activeUsersLast30Days ?? 0}
          valueHint="active 30d"
          onOpen={open('presence')}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <BarChart
              height={100}
              borderRadius={6}
              xAxis={[
                {
                  data: presence.map((_, i) => i),
                  scaleType: 'band',
                  categoryGapRatio: 0.45,
                },
              ]}
              series={[
                {
                  data: presence.map((p) => p.value),
                  color: chartColor,
                },
              ]}
              margin={miniChartMargin}
              hideLegend
              sx={miniChartSx}
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.content}
          value={seriesTotal(contentSpark)}
          valueHint="notes (period)"
          onOpen={open('content')}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={contentSpark.length ? contentSpark : [0]}
              height={100}
              color={chartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.engagement}
          value={formatPercent(data?.engagement?.submissionRate)}
          valueHint="submission rate"
          onOpen={open('engagement')}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={engagement.values.length ? engagement.values : [0]}
              height={100}
              color={chartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.subjects}
          value={seriesLatest(subjectsSpark)}
          valueHint="top subject pulse"
          onOpen={open('subjects')}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={subjectsSpark.length ? subjectsSpark : [0]}
              height={100}
              color={chartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.grades}
          value={seriesAverage(gradesSpark)}
          valueHint="avg band"
          onOpen={open('grades')}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={gradesSpark.length ? gradesSpark : [0]}
              height={100}
              color={chartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.modules}
          value={modulesCount}
          valueHint={`${formatPercent(modulesAvgRate)} avg · ${modulesSubmissions} submits`}
          onOpen={open('modules')}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : moduleBars.labels.length === 0 ? null : (
            <BarChart
              height={100}
              borderRadius={4}
              xAxis={[
                {
                  data: moduleBars.labels,
                  scaleType: 'band',
                  categoryGapRatio: 0.35,
                },
              ]}
              series={[
                {
                  data: moduleBars.assigned,
                  label: 'Assigned',
                  color: compare.neutral,
                },
                {
                  data: moduleBars.submitted,
                  label: 'Submitted',
                  color: compare.primary,
                },
              ]}
              margin={miniChartMargin}
              hideLegend
              sx={miniChartSx}
            />
          )}
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
          <AdminInsightDetail
            insight={activeInsight}
            detail={needsRemote ? remoteDetail : null}
            homeData={data}
          />
        ) : null}
      </DashboardDetailModal>
    </>
  );
}
