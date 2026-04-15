'use client';

import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import StatCard from '../StatCard';
import type { StatCardProps } from '../StatCard';
import CustomizedDataGrid from '../CustomizedDataGrid';
import PageViewsBarChart from '../PageViewsBarChart';
import ActiveSubjectsChart from '../ActiveSubjectsChart';
import PlatformOwnerDashboard from '../PlatformOwnerDashboard';
import { useInstitutionDashboard } from '@/app/_lib/hooks/useDashboard';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { INSTITUTION_DASHBOARD_TITLE, STAT_INTERVAL } from './constants';
import { normalizeRole, normalizeTrend } from './utils';
import { DashboardGrid, HeaderBox, DescriptionText, GrowGridItem } from './elements';

export default function MainGrid() {
  const { data: session } = useSession();
  const rawRole = session?.user?.role;
  const normalizedRole = normalizeRole(rawRole);
  const isPlatformOwner = normalizedRole === UserRole.PlatformAdmin;

  if (isPlatformOwner) {
    return <PlatformOwnerDashboard />;
  }

  return <InstitutionMainGrid />;
}

function InstitutionMainGrid() {
  const { data: institutionData, isLoading } = useInstitutionDashboard();

  const institutionStats: StatCardProps[] = [
    {
      title: 'Instructors',
      value: `${institutionData?.teachers?.total}`,
      interval: STAT_INTERVAL,
      trend: normalizeTrend(institutionData?.teachers?.trend),
      data: institutionData?.teachers?.dataPoints || [],
      loading: isLoading,
    },
    {
      title: 'Trainees',
      value: `${institutionData?.students?.total}`,
      interval: STAT_INTERVAL,
      trend: normalizeTrend(institutionData?.students?.trend),
      data: institutionData?.students?.dataPoints || [],
      loading: isLoading,
    },
    {
      title: 'Notes created',
      value: `${institutionData?.notesCreated?.total}`,
      interval: STAT_INTERVAL,
      trend: normalizeTrend(institutionData?.notesCreated?.trend),
      data: institutionData?.notesCreated?.dataPoints || [],
      loading: isLoading,
    },
    {
      title: 'Modules created',
      value: `${institutionData?.homeworkCreated?.total}`,
      interval: STAT_INTERVAL,
      trend: normalizeTrend(institutionData?.homeworkCreated?.trend),
      data: institutionData?.homeworkCreated?.dataPoints || [],
      loading: isLoading,
    },
  ];

  return (
    <DashboardGrid container spacing={2} columns={12} p={3}>
      <Grid size={{ xs: 12 }}>
        <HeaderBox>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {INSTITUTION_DASHBOARD_TITLE}
          </Typography>
          <DescriptionText variant="body2" color="text.secondary">
            Track your institution's key metrics at a glance. The cards below show activity over the{' '}
            <strong>last 30 days</strong>—hover over the trend chip to see how performance compares
            between the first and second half of the period. The sparkline visualizes daily activity.
          </DescriptionText>
        </HeaderBox>
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

      <GrowGridItem size={{ xs: 12, lg: 12 }}>
        <CustomizedDataGrid
          rows={institutionData?.recentHomeworkStats || []}
          isLoading={isLoading}
        />
      </GrowGridItem>
    </DashboardGrid>
  );
}
