'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewBarChart';
import SessionsChart from './ActiveSubjectChart';
import StatCard, { StatCardProps } from './StartCard';
import { Grid, useTheme } from '@mui/material';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import {
  useSystemDashboard,
  useInstitutionDashboard,
} from '@/app/_lib/hooks/useDashboard';
import ActiveSubjectsChart from './ActiveSubjectChart';

export default function MainGrid() {
  const { data: session } = useSession();
  const isSystemAdmin = session?.user?.role === UserRole.PlatformAdmin;
  const theme = useTheme();

  const { data: systemData } = useSystemDashboard();
  const { data: institutionData, isLoading } = useInstitutionDashboard();

  const peakHoursData = (systemData?.peakUsageHours || []).map(
    (hourStat) => `${hourStat.hour}:00`
  );
  const peakLogins = (systemData?.peakUsageHours || []).map(
    (hourStat) => hourStat.count
  );

  const institutionStats: StatCardProps[] = [
    {
      title: 'Instructors',
      value: `${institutionData?.teachers?.total}`,
      interval: 'Last 30 days',
      trend:
        institutionData?.teachers?.trend === 'up' ||
        institutionData?.teachers?.trend === 'down' ||
        institutionData?.teachers?.trend === 'neutral'
          ? institutionData?.teachers?.trend
          : 'neutral',
      data: institutionData?.teachers?.dataPoints || [],
      loading: isLoading,
    },
    {
      title: 'Trainees',
      value: `${institutionData?.students?.total}`,
      interval: 'Last 30 days',
      trend:
        institutionData?.students?.trend === 'up' ||
        institutionData?.students?.trend === 'down' ||
        institutionData?.students?.trend === 'neutral'
          ? institutionData?.students?.trend
          : 'neutral',
      data: institutionData?.students?.dataPoints || [],
      loading: isLoading,
    },
    {
      title: 'Notes created',
      value: `${institutionData?.notesCreated?.total}`,
      interval: 'Last 30 days',
      trend:
        institutionData?.notesCreated?.trend === 'up' ||
        institutionData?.notesCreated?.trend === 'down' ||
        institutionData?.notesCreated?.trend === 'neutral'
          ? institutionData?.notesCreated?.trend
          : 'neutral',
      data: institutionData?.notesCreated?.dataPoints || [],
      loading: isLoading,
    },
    {
      title: 'Modules created',
      value: `${institutionData?.homeworkCreated?.total}`,
      interval: 'Last 30 days',
      trend:
        institutionData?.homeworkCreated?.trend === 'up' ||
        institutionData?.homeworkCreated?.trend === 'down' ||
        institutionData?.homeworkCreated?.trend === 'neutral'
          ? institutionData?.homeworkCreated?.trend
          : 'neutral',
      data: institutionData?.homeworkCreated?.dataPoints || [],
      loading: isLoading,
    },
  ];

  return (
    <Grid
      container
      spacing={2}
      columns={12}
      sx={{
        mb: (theme) => theme.spacing(2),
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Grid size={{ xs: 12 }}>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Overview
        </Typography>
      </Grid>
      {institutionStats.map((card, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard {...card} />
        </Grid>
      ))}
      <Grid size={{ xs: 12, md: 6 }}>
        <ActiveSubjectsChart
          isLoading={isLoading}
          labels={institutionData?.mostActiveSubjects?.labels || []}
          series={institutionData?.mostActiveSubjects?.series || []}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PageViewsBarChart
          isLoading={isLoading}
          months={institutionData?.gradePerformanceMonths || []}
          series={institutionData?.gradePerformance || []}
          trend={institutionData?.gradePerformanceTrends?.color || 'default'}
          numberOfTrainees={institutionData?.students?.total || 0}
          average={
            institutionData?.gradePerformanceTrends?.average != null
              ? `+${institutionData.gradePerformanceTrends.average.toFixed(1)}%`
              : '+0%'
          }
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }} sx={{ flexGrow: 1 }}>
        <CustomizedDataGrid
          rows={institutionData?.recentHomeworkStats || []}
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  );
}
