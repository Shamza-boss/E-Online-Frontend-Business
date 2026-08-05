'use client';

import { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';
import RoleHomeShell from '../RoleHomeShell';
import { dashboardSeriesColors } from '../RoleHomeShell/chartTheme';
import InsightSummaryCard, { InsightListPreview } from '../InsightSummaryCard';
import DashboardDetailModal from '../DashboardDetailModal';
import {
  useInstructorHomeDashboard,
  useDashboardInsight,
} from '@/app/_lib/hooks/useDashboard';
import type { InstructorInsightId } from '@/app/_lib/types/dashboardInsights';
import {
  ACTIONS_EMPTY,
  AT_RISK_EMPTY,
  DESCRIPTION,
  DETAIL_LOAD_ERROR,
  HEAVY_LOAD_EMPTY,
  INSIGHT_SUBTITLES,
  INSIGHT_TITLES,
  TITLE,
  UNASSIGNED_EMPTY,
} from './constants';
import { actionItemCount, buildActionSeries, formatRate } from './utils';
import type { InstructorDashboardHomeProps } from './utils';
import InstructorInsightDetail from './details/InstructorInsightDetail';
import {
  courseHrefFromAction,
  formatActionWhen,
  statusLabel,
  urgencyFromAction,
  urgencyFromSubmissionRate,
  urgencyPaletteKey,
  worstUrgency,
} from './urgency';

const REMOTE: ReadonlySet<InstructorInsightId> = new Set([
  'workload',
  'unassigned',
  'heavyLoad',
]);

export default function InstructorDashboardHome({
  initialData,
}: InstructorDashboardHomeProps) {
  const theme = useTheme();
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
  const unassigned = data?.unassignedStudents ?? [];
  const heavyLoad = data?.heavyLoadStudents ?? [];
  const unassignedCount = data?.unassignedStudentCount ?? unassigned.length;
  const heavyLoadCount = data?.heavyLoadStudentCount ?? heavyLoad.length;
  const actions = data?.actionItems ?? [];
  const actionCount = actionItemCount(data);
  const workload = buildActionSeries(data);
  const sliceColors = dashboardSeriesColors(theme, workload.length);

  const submissionTone = urgencyFromSubmissionRate(data?.mySubmissionRate ?? 0);
  const submissionColor = urgencyPaletteKey(submissionTone);
  const actionTone = actions.length
    ? worstUrgency(actions.map((item) => urgencyFromAction(item)))
    : actionCount > 0
      ? 'soon'
      : 'calm';
  const actionColor = urgencyPaletteKey(actionTone);
  const atRiskColor = urgencyPaletteKey(atRisk.length > 0 ? 'urgent' : 'calm');
  const unassignedColor = urgencyPaletteKey(
    unassignedCount > 0 ? 'soon' : 'calm',
  );
  const heavyLoadColor = urgencyPaletteKey(
    heavyLoadCount > 0 ? 'urgent' : 'calm',
  );

  const workloadColors = workload.map((item) => {
    if (item.label === 'Expired') return theme.palette.error.main;
    if (item.label === 'Expiring') return theme.palette.warning.main;
    if (item.label === 'Exams') return theme.palette.success.main;
    if (item.label === 'Drafts') return theme.palette.primary.main;
    return theme.palette.primary.main;
  });

  const actionPreview = actions.slice(0, 4).map((item) => {
    const tone = urgencyFromAction(item);
    const href = courseHrefFromAction(item);
    return {
      id: item.homeworkId,
      primary: item.title,
      secondary: `${statusLabel(item.status)} · ${formatActionWhen(item.relevantAt)}`,
      tone,
      href,
      tooltip: [
        item.title,
        statusLabel(item.status),
        item.classroomName ? `Course: ${item.classroomName}` : null,
        href ? 'Click to open the course' : null,
      ]
        .filter(Boolean)
        .join(' · '),
    };
  });

  const atRiskPreview = atRisk.slice(0, 4).map((trainee) => {
    const inactiveDays = trainee.lastSeenAt
      ? Math.ceil(
          (Date.now() - new Date(trainee.lastSeenAt).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 99;
    const tone =
      !trainee.lastSeenAt || inactiveDays >= 14
        ? ('urgent' as const)
        : inactiveDays >= 7
          ? ('soon' as const)
          : ('time' as const);
    return {
      id: trainee.userId,
      primary: `${trainee.firstName} ${trainee.lastName}`.trim() || trainee.email,
      secondary: trainee.reason || 'At risk',
      tone,
      tooltip: [
        `${trainee.firstName} ${trainee.lastName}`.trim(),
        trainee.email,
        trainee.reason,
      ]
        .filter(Boolean)
        .join(' · '),
    };
  });

  const unassignedPreview = unassigned.slice(0, 4).map((student) => ({
    id: student.userId,
    primary: `${student.firstName} ${student.lastName}`.trim() || student.email,
    secondary: student.lastSeenAt
      ? `Seen ${formatActionWhen(student.lastSeenAt)}`
      : 'Never logged in',
    tone: 'soon' as const,
    tooltip: [
      `${student.firstName} ${student.lastName}`.trim(),
      student.email,
      'Not enrolled in any class',
    ]
      .filter(Boolean)
      .join(' · '),
  }));

  const heavyPreview = heavyLoad.slice(0, 4).map((student) => {
    const tone =
      student.peakDueCount >= 6
        ? ('urgent' as const)
        : ('soon' as const);
    return {
      id: student.userId,
      primary: `${student.firstName} ${student.lastName}`.trim() || student.email,
      secondary: student.reason,
      tone,
      tooltip: [
        `${student.firstName} ${student.lastName}`.trim(),
        student.email,
        student.reason,
      ]
        .filter(Boolean)
        .join(' · '),
    };
  });

  const canExpandWorkload = actionCount > 0;
  const canExpandAtRisk = atRisk.length > 0;
  const canExpandUnassigned = unassignedCount > 0;
  const canExpandHeavyLoad = heavyLoadCount > 0;

  const open = (id: InstructorInsightId) => () => setActiveInsight(id);
  const close = () => setActiveInsight(null);

  return (
    <>
      <RoleHomeShell
        title={TITLE}
        description={DESCRIPTION}
        columns={2}
        heroes={[
          {
            label: 'Submission rate',
            value: formatRate(data?.mySubmissionRate),
            hint: `${data?.activeTraineesLast7Days ?? 0} active trainees (7d)`,
            valueColor: submissionColor,
          },
        ]}
      >
        <InsightSummaryCard
          title={INSIGHT_TITLES.workload}
          value={actionCount}
          valueHint="needing you"
          valueColor={actionCount > 0 ? actionColor : 'primary.main'}
          onOpen={canExpandWorkload ? open('workload') : undefined}
          hoverTooltip="Expired drafts = red · expiring soon = orange · exams opening = green · drafts = blue."
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : actionPreview.length > 0 ? (
            <InsightListPreview items={actionPreview} emptyLabel={ACTIONS_EMPTY} />
          ) : (
            <PieChart
              height={110}
              series={[
                {
                  data: workload.map((item, index) => ({
                    id: item.id,
                    value: item.value,
                    color:
                      workloadColors[index] ??
                      sliceColors[index % sliceColors.length],
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
          valueColor={atRisk.length > 0 ? atRiskColor : 'primary.main'}
          onOpen={canExpandAtRisk ? open('atRisk') : undefined}
          hoverTooltip="Inactive or overdue trainees who need a nudge."
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <InsightListPreview items={atRiskPreview} emptyLabel={AT_RISK_EMPTY} />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.heavyLoad}
          value={heavyLoadCount}
          valueHint="under pressure"
          valueColor={heavyLoadCount > 0 ? heavyLoadColor : 'primary.main'}
          onOpen={canExpandHeavyLoad ? open('heavyLoad') : undefined}
          hoverTooltip="Open assessments due in a tight 7-day cluster across their classes (threshold: 4+)."
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <InsightListPreview
              items={heavyPreview}
              emptyLabel={HEAVY_LOAD_EMPTY}
            />
          )}
        </InsightSummaryCard>

        <InsightSummaryCard
          title={INSIGHT_TITLES.unassigned}
          value={unassignedCount}
          valueHint="no class yet"
          valueColor={unassignedCount > 0 ? unassignedColor : 'primary.main'}
          onOpen={canExpandUnassigned ? open('unassigned') : undefined}
          hoverTooltip="Institution students with zero classroom enrollments."
        >
          {isLoading ? (
            <Skeleton variant="rounded" height="100%" />
          ) : (
            <InsightListPreview
              items={unassignedPreview}
              emptyLabel={UNASSIGNED_EMPTY}
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
