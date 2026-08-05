'use client';

import { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import RoleHomeShell from '../RoleHomeShell';
import { miniChartMargin, miniChartSx } from '../RoleHomeShell/miniChart';
import {
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
import {
  toneHex,
  urgencyFromActiveShare,
  urgencyFromAttentionCount,
  urgencyFromGrade,
  urgencyFromRate,
  urgencyPaletteKey,
} from './urgency';

export default function AdminDashboardHome({
  initialData,
}: AdminDashboardHomeProps) {
  const theme = useTheme();
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

  const peopleTotal =
    (data?.teachers?.total ?? 0) + (data?.students?.total ?? 0);
  const active30 = data?.activeUsersLast30Days ?? 0;
  const neverIn = data?.neverLoggedInCount ?? 0;

  const peopleTone = urgencyFromActiveShare(active30, peopleTotal);
  const followUpTone = urgencyFromAttentionCount(inactive.length);
  const presenceTone = urgencyFromAttentionCount(neverIn);
  const engagementTone = urgencyFromRate(data?.engagement?.submissionRate);
  const contentTone =
    seriesTotal(contentSpark) <= 0
      ? ('soon' as const)
      : seriesTotal(contentSpark) >= 20
        ? ('time' as const)
        : ('calm' as const);
  const subjectsTone =
    seriesLatest(subjectsSpark) <= 0 ? ('soon' as const) : ('calm' as const);
  const gradesTone = urgencyFromGrade(seriesAverage(gradesSpark));
  const modulesTone = urgencyFromRate(modulesAvgRate);

  const peopleColor = urgencyPaletteKey(peopleTone);
  const followUpColor = urgencyPaletteKey(followUpTone);
  const presenceColor = urgencyPaletteKey(presenceTone);
  const contentColor = urgencyPaletteKey(contentTone);
  const engagementColor = urgencyPaletteKey(engagementTone);
  const subjectsColor = urgencyPaletteKey(subjectsTone);
  const gradesColor = urgencyPaletteKey(gradesTone);
  const modulesColor = urgencyPaletteKey(modulesTone);

  const presenceChartColor = toneHex(theme, presenceTone);
  const contentChartColor = toneHex(theme, contentTone);
  const engagementChartColor = toneHex(theme, engagementTone);
  const subjectsChartColor = toneHex(theme, subjectsTone);
  const gradesChartColor = toneHex(theme, gradesTone);
  const modulesAssignedColor =
    modulesTone === 'urgent' ? theme.palette.error.main : compare.neutral;
  const modulesSubmittedColor = toneHex(theme, modulesTone);

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
            value: `${peopleTotal}`,
            hint: `${data?.teachers?.total ?? 0} instructors · ${data?.students?.total ?? 0} trainees`,
            valueColor: peopleColor,
            onOpen: open('presence'),
          },
          {
            label: 'Follow-ups',
            value: `${inactive.length}`,
            hint: inactive.length ? 'Tap to review' : 'All clear',
            valueColor: inactive.length > 0 ? followUpColor : 'primary.main',
            onOpen: open('followUps'),
          },
        ]}
      >
        <InsightSummaryCard
          title={INSIGHT_TITLES.presence}
          value={active30}
          valueHint="active 30d"
          valueColor={presenceColor}
          onOpen={open('presence')}
          hoverTooltip={`Active 30d: ${active30}. Never logged in: ${neverIn}. Red = activation gaps, green = healthy presence, blue = steady.`}
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
                  color: presenceChartColor,
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
          valueColor={contentColor}
          onOpen={open('content')}
          hoverTooltip="Note activity for the period. Green when content is flowing; orange when quiet."
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={contentSpark.length ? contentSpark : [0]}
              height={100}
              color={contentChartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.engagement}
          value={formatPercent(data?.engagement?.submissionRate)}
          valueHint="submission rate"
          valueColor={engagementColor}
          onOpen={open('engagement')}
          hoverTooltip={`Submission ${formatPercent(data?.engagement?.submissionRate)}. Blue = steady, green = strong intake, red = class lagging.`}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={engagement.values.length ? engagement.values : [0]}
              height={100}
              color={engagementChartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.subjects}
          value={seriesLatest(subjectsSpark)}
          valueHint="top subject pulse"
          valueColor={subjectsColor}
          onOpen={open('subjects')}
          hoverTooltip="Latest pulse on the most active subject series."
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={subjectsSpark.length ? subjectsSpark : [0]}
              height={100}
              color={subjectsChartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.grades}
          value={seriesAverage(gradesSpark)}
          valueHint="avg band"
          valueColor={gradesColor}
          onOpen={open('grades')}
          hoverTooltip="Average grade-band signal. Red below 50, blue mid range, green at 75+."
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <SparkLineChart
              data={gradesSpark.length ? gradesSpark : [0]}
              height={100}
              color={gradesChartColor}
              curve="natural"
              area
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.modules}
          value={modulesCount}
          valueHint={`${formatPercent(modulesAvgRate)} avg · ${modulesSubmissions} submits`}
          valueColor={modulesColor}
          onOpen={open('modules')}
          hoverTooltip={`Recent modules: ${modulesCount}. Avg submission ${formatPercent(modulesAvgRate)}.`}
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
                  color: modulesAssignedColor,
                },
                {
                  data: moduleBars.submitted,
                  label: 'Submitted',
                  color: modulesSubmittedColor,
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
