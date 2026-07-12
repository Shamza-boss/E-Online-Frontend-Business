'use client';

import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import StatCard from '../StatCard';
import CustomizedDataGrid from '../CustomizedDataGrid';
import PageViewsBarChart from '../PageViewsBarChart';
import ActiveSubjectsChart from '../ActiveSubjectsChart';
import PlatformOwnerDashboard from '../PlatformOwnerDashboard';
import { useInstitutionDashboard } from '@/app/_lib/hooks/useDashboard';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import type {
  InstitutionTrendsDashboardDto,
  PlatformOwnerDashboardDto,
} from '@/app/_lib/interfaces/types';
import {
  INSTITUTION_DASHBOARD_TITLE,
  INSTITUTION_DASHBOARD_DESCRIPTION,
} from './constants';
import { buildStatCard, formatTrendAverage, normalizeGradeTrendColor } from './utils';
import { DashboardGrid, HeaderBox, DescriptionText } from './elements';

export type MainGridProps = {
  role: UserRole;
  initialData: InstitutionTrendsDashboardDto | PlatformOwnerDashboardDto;
}

export default function MainGrid({ role, initialData }: MainGridProps) {
  if (role === UserRole.PlatformAdmin) {
    return (
      <PlatformOwnerDashboard
        initialData={initialData as PlatformOwnerDashboardDto}
      />
    );
  }

  return (
    <InstitutionMainGrid initialData={initialData as InstitutionTrendsDashboardDto} />
  );
}

type InstitutionMainGridProps = {
  initialData: InstitutionTrendsDashboardDto;
}

function InstitutionMainGrid({ initialData }: InstitutionMainGridProps) {
  const { data: institutionData, isLoading } = useInstitutionDashboard(initialData);

  const institutionStats = [
    buildStatCard('Instructors', institutionData?.teachers, isLoading),
    buildStatCard('Trainees', institutionData?.students, isLoading),
    buildStatCard('Notes created', institutionData?.notesCreated, isLoading),
    buildStatCard('Modules created', institutionData?.homeworkCreated, isLoading),
  ];

  const gradeTrend = institutionData?.gradePerformanceTrends;

  return (
    <DashboardGrid container spacing={{ xs: 1.5, sm: 2 }} columns={12}>
      <Grid size={{ xs: 12 }}>
        <HeaderBox>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {INSTITUTION_DASHBOARD_TITLE}
          </Typography>
          <DescriptionText variant="body2" color="text.secondary">
            {INSTITUTION_DASHBOARD_DESCRIPTION}
          </DescriptionText>
        </HeaderBox>
      </Grid>

      {institutionStats.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard {...card} />
        </Grid>
      ))}

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Active (7 days)"
          value={`${institutionData?.activeUsersLast7Days ?? 0}`}
          interval="Presence"
          trend="neutral"
          data={[]}
          loading={isLoading}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Active (30 days)"
          value={`${institutionData?.activeUsersLast30Days ?? 0}`}
          interval="Presence"
          trend="neutral"
          data={[]}
          loading={isLoading}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Never logged in"
          value={`${institutionData?.neverLoggedInCount ?? 0}`}
          interval="Presence"
          trend="neutral"
          data={[]}
          loading={isLoading}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Instructors active"
          value={`${institutionData?.activeInstructorsLast30Days ?? 0}`}
          interval="Last 30 days"
          trend="neutral"
          data={[]}
          loading={isLoading}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ActiveSubjectsChart
          isLoading={isLoading}
          labels={institutionData?.mostActiveSubjects?.labels ?? []}
          series={institutionData?.mostActiveSubjects?.series ?? []}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <PageViewsBarChart
          isLoading={isLoading}
          months={institutionData?.gradePerformanceMonths ?? []}
          series={institutionData?.gradePerformance ?? []}
          trend={normalizeGradeTrendColor(gradeTrend?.color)}
          numberOfTrainees={institutionData?.students?.total ?? 0}
          average={formatTrendAverage(gradeTrend?.average)}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <CustomizedDataGrid
          rows={institutionData?.recentHomeworkStats ?? []}
          isLoading={isLoading}
        />
      </Grid>
    </DashboardGrid>
  );
}
