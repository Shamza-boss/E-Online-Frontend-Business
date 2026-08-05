'use client';

import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { PieChart } from '@mui/x-charts/PieChart';
import RoleHomeShell from '../RoleHomeShell';
import {
  dashboardChartColor,
  dashboardSeriesColors,
} from '../RoleHomeShell/chartTheme';
import InsightSummaryCard, { InsightListPreview } from '../InsightSummaryCard';
import { useTraineeHomeDashboard } from '@/app/_lib/hooks/useDashboard';
import {
  DESCRIPTION,
  EXAM_EMPTY,
  INSIGHT_TITLES,
  NEXT_DUE_EMPTY,
  TITLE,
} from './constants';
import {
  buildWorkloadPie,
  clampGrade,
  formatRate,
  toPercent,
} from './utils';
import type { TraineeDashboardHomeProps } from './utils';
import {
  canCompleteDueItemNow,
  courseHrefFromDueItem,
  formatDueCountdown,
  urgencyFromDueItem,
  urgencyFromGrade,
  urgencyPaletteKey,
  worstUrgency,
} from './urgency';

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
  const { data, isLoading } = useTraineeHomeDashboard(initialData);

  const nextDue = data?.nextDue ?? [];
  const grade = clampGrade(data?.myAverageGrade);
  const submissionPct = toPercent(data?.mySubmissionRate);
  const workload = buildWorkloadPie(data);
  const overdueCount = data?.overdueCount ?? 0;
  const dueSoonCount = data?.dueSoonCount ?? 0;
  const sliceColors = dashboardSeriesColors(theme, workload.length);

  const gradeTone = urgencyFromGrade(grade);
  const gradeColor = urgencyPaletteKey(gradeTone);
  const overdueColor = urgencyPaletteKey('urgent');
  const dueSoonColor = urgencyPaletteKey(
    overdueCount > 0 ? 'calm' : dueSoonCount > 0 ? 'time' : 'calm',
  );

  // Workload pie: overdue slice red, due-soon green/blue calm when zero overdue
  const workloadColors = workload.map((item) => {
    if (item.label === 'Overdue') return theme.palette.error.main;
    if (item.label === 'Due soon') return theme.palette.success.main;
    return theme.palette.primary.main;
  });

  const duePreview = nextDue.slice(0, 4).map((item) => {
    const tone = urgencyFromDueItem(item);
    const href = canCompleteDueItemNow(item)
      ? courseHrefFromDueItem(item)
      : null;
    return {
      id: item.assignmentId,
      primary: item.title,
      secondary: item.isOverdue ? 'Overdue' : formatDueCountdown(item.dueDate),
      tone,
      href,
      tooltip: [
        item.title,
        item.classroomName ? `Course: ${item.classroomName}` : null,
        item.isExam ? 'Exam' : 'Module',
        item.dueDate ? `Due ${shortDue(item.dueDate)}` : null,
        tone === 'urgent'
          ? 'Due today or overdue'
          : tone === 'soon'
            ? 'Due tomorrow'
            : tone === 'time'
              ? 'Smart to do soon'
              : 'Still further out — calm',
        href ? 'Click to open the course' : null,
      ]
        .filter(Boolean)
        .join(' · '),
    };
  });

  const examPreview = data?.nextExamTitle
    ? [
        {
          id: 'next-exam',
          primary: data.nextExamTitle,
          secondary: formatDueCountdown(data.nextExamScheduledAt),
          tone: urgencyFromDueItem({
            isOverdue: false,
            dueDate: data.nextExamScheduledAt,
          }),
          tooltip: [
            data.nextExamTitle,
            `Scheduled ${shortDue(data.nextExamScheduledAt)}`,
            'Prepare in the related course when this exam opens',
          ].join(' · '),
        },
        {
          id: 'next-exam-date',
          primary: 'Scheduled',
          secondary: shortDue(data.nextExamScheduledAt),
          tone: 'calm' as const,
        },
      ]
    : [];

  const gaugeColor =
    gradeTone === 'urgent'
      ? theme.palette.error.main
      : gradeTone === 'time'
        ? theme.palette.success.main
        : dashboardChartColor(theme);

  return (
    <RoleHomeShell
      title={TITLE}
      description={DESCRIPTION}
      columns={2}
      heroes={[
        {
          label: 'Due soon',
          value: `${dueSoonCount}`,
          hint: 'Next 7 days',
          valueColor: dueSoonColor,
        },
        {
          label: 'Overdue',
          value: `${overdueCount}`,
          hint: overdueCount > 0 ? 'Handle these first' : 'You are clear',
          valueColor: overdueCount > 0 ? overdueColor : 'primary.main',
        },
        {
          label: 'Average grade',
          value: `${grade}`,
          hint: `Submission ${formatRate(data?.mySubmissionRate)}`,
          valueColor: gradeColor,
        },
      ]}
    >
      <InsightSummaryCard
        title={INSIGHT_TITLES.progress}
        value={grade}
        valueHint={`submit ${submissionPct}%`}
        valueColor={gradeColor}
        hoverTooltip={`Average grade ${grade}. Submission rate ${formatRate(data?.mySubmissionRate)}. Blue = solid footing, green = strong progress, red = needs attention.`}
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
              [`& .${gaugeClasses.valueArc}`]: { fill: gaugeColor },
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
        valueColor={
          overdueCount > 0 ? overdueColor : dueSoonCount > 0 ? dueSoonColor : 'primary.main'
        }
        hoverTooltip={`Due soon: ${dueSoonCount}. Overdue: ${overdueCount}. Green means time left; red means overdue; blue means calm.`}
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
        title={INSIGHT_TITLES.nextDue}
        value={nextDue.length}
        valueHint="coming up"
        valueColor={
          nextDue.length
            ? urgencyPaletteKey(
                worstUrgency(nextDue.map((item) => urgencyFromDueItem(item))),
              )
            : 'primary.main'
        }
        hoverTooltip="Due today = red · tomorrow = orange · next few days = green (smart now) · further out = blue (calm)."
      >
        {isLoading ? (
          <Skeleton variant="rounded" height="100%" />
        ) : (
          <InsightListPreview items={duePreview} emptyLabel={NEXT_DUE_EMPTY} />
        )}
      </InsightSummaryCard>

      <InsightSummaryCard
        title={INSIGHT_TITLES.nextExam}
        value={data?.nextExamTitle ? shortDue(data?.nextExamScheduledAt) : '—'}
        valueHint={data?.nextExamTitle ?? 'None scheduled'}
        valueColor={
          data?.nextExamScheduledAt
            ? urgencyPaletteKey(
                urgencyFromDueItem({
                  isOverdue: false,
                  dueDate: data.nextExamScheduledAt,
                }),
              )
            : 'primary.main'
        }
        hoverTooltip={
          data?.nextExamTitle
            ? `${data.nextExamTitle} · ${shortDue(data.nextExamScheduledAt)}. Green means you still have time to prepare.`
            : EXAM_EMPTY
        }
      >
        {isLoading ? (
          <Skeleton variant="rounded" height="100%" />
        ) : (
          <InsightListPreview items={examPreview} emptyLabel={EXAM_EMPTY} />
        )}
      </InsightSummaryCard>
    </RoleHomeShell>
  );
}
