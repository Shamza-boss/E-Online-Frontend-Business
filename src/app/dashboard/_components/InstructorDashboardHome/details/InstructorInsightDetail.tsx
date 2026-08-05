'use client';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { ChartPanel } from '../../RoleHomeShell';
import type { InstructorHomeDashboardDto } from '@/app/_lib/types/dashboardHome';
import type { InstructorInsightId } from '@/app/_lib/types/dashboardInsights';
import type { InstructorWorkloadInsightDto } from '@/app/_lib/types/dashboardInsights';
import { AT_RISK_EMPTY, WORKLOAD_EMPTY } from '../constants';
import { formatRate, toPercent } from '../utils';

type InstructorInsightDetailProps = {
  insight: InstructorInsightId;
  detail: unknown;
  homeData?: InstructorHomeDashboardDto;
};

export default function InstructorInsightDetail({
  insight,
  detail,
  homeData,
}: InstructorInsightDetailProps) {
  const theme = useTheme();

  if (insight === 'submission') {
    const pct = toPercent(homeData?.mySubmissionRate);
    return (
      <Stack spacing={3} alignItems="center">
        <Gauge
          value={pct}
          startAngle={-110}
          endAngle={110}
          height={260}
          cornerRadius="50%"
          sx={{
            [`& .${gaugeClasses.valueText}`]: { fontSize: 36, fontWeight: 700 },
            [`& .${gaugeClasses.valueArc}`]: { fill: theme.palette.primary.main },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: theme.palette.action.hover,
            },
          }}
          text={({ value }) => `${value}%`}
        />
        <Typography variant="body1">
          Submission {formatRate(homeData?.mySubmissionRate)} ·{' '}
          {homeData?.pendingToGradeCount ?? 0} waiting to grade ·{' '}
          {homeData?.activeTraineesLast7Days ?? 0} active trainees (7d)
        </Typography>
      </Stack>
    );
  }

  if (insight === 'workload') {
    const data = (detail ?? {}) as InstructorWorkloadInsightDto;
    const queue = data.pendingGradeQueue ?? [];
    return (
      <Stack spacing={3}>
        <Typography variant="body2" color="text.secondary">
          {homeData?.pendingToGradeCount ?? 0} to grade ·{' '}
          {homeData?.upcomingDueCount ?? 0} due in 14 days
        </Typography>
        <ChartPanel elevation={0} variant="outlined">
          <Typography variant="subtitle2" fontWeight={700}>
            Pending grade queue
          </Typography>
          {queue.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {WORKLOAD_EMPTY}
            </Typography>
          ) : (
            <Stack spacing={1.25}>
              {queue.map((item) => (
                <Stack
                  key={item.assignmentId}
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  justifyContent="space-between"
                  alignItems={{ sm: 'center' }}
                >
                  <Typography variant="body2">
                    {item.moduleTitle}
                    <Typography component="span" variant="body2" color="text.secondary">
                      {' '}
                      · {item.traineeName}
                    </Typography>
                  </Typography>
                  <Chip
                    size="small"
                    label={
                      item.submittedAt
                        ? new Date(item.submittedAt).toLocaleString()
                        : 'Submitted'
                    }
                  />
                </Stack>
              ))}
            </Stack>
          )}
        </ChartPanel>
        {(data.upcomingDue?.length ?? 0) > 0 && (
          <ChartPanel elevation={0} variant="outlined">
            <Typography variant="subtitle2" fontWeight={700}>
              Upcoming due
            </Typography>
            <Stack spacing={1.25}>
              {(data.upcomingDue ?? []).map((item) => (
                <Stack
                  key={item.homeworkId}
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2">{item.title}</Typography>
                  <Stack direction="row" spacing={1}>
                    {item.isExam && <Chip size="small" color="warning" label="Exam" />}
                    <Chip
                      size="small"
                      label={
                        item.dueDate
                          ? new Date(item.dueDate).toLocaleDateString()
                          : '—'
                      }
                    />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </ChartPanel>
        )}
      </Stack>
    );
  }

  const atRisk = homeData?.atRiskTrainees ?? [];
  return (
    <ChartPanel elevation={0} variant="outlined">
      {atRisk.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {AT_RISK_EMPTY}
        </Typography>
      ) : (
        <Stack spacing={1.25}>
          {atRisk.map((trainee) => (
            <Stack
              key={trainee.userId}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
            >
              <Typography variant="body2" noWrap sx={{ minWidth: 0 }}>
                {trainee.firstName} {trainee.lastName}
                <Typography component="span" variant="body2" color="text.secondary">
                  {' '}
                  · {trainee.email}
                </Typography>
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  size="small"
                  label={
                    trainee.lastSeenAt
                      ? new Date(trainee.lastSeenAt).toLocaleDateString()
                      : 'Never'
                  }
                />
                <Chip size="small" color="warning" label={trainee.reason ?? 'At risk'} />
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}
    </ChartPanel>
  );
}
