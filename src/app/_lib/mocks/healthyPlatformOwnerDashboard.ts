import type { PlatformOwnerDashboardDto } from '@/app/_lib/interfaces/types';
import type { PlatformOwnerHealthFields } from '@/app/_lib/types/dashboardHome';
import { daysAgoIso, last6MonthLabels, risingSeries, uuid } from './mockHelpers';

export type PlatformOwnerDashboardMock = PlatformOwnerDashboardDto &
  PlatformOwnerHealthFields;

const ORGS = [
  { name: 'Crestview College', users: 670, activePct: 92, days: 0 },
  { name: 'Horizon Academy', users: 410, activePct: 88, days: 1 },
  { name: 'Riverbend High', users: 520, activePct: 81, days: 2 },
  { name: 'Oakridge Institute', users: 290, activePct: 76, days: 3 },
  { name: 'Northbridge STEM', users: 340, activePct: 84, days: 1 },
  { name: 'Silverlake Prep', users: 180, activePct: 71, days: 5 },
  { name: 'Summit Tutorial', users: 95, activePct: 64, days: 8 },
  { name: 'Azure Learning Hub', users: 220, activePct: 79, days: 2 },
  { name: 'Cape Digital School', users: 150, activePct: 58, days: 12 },
  { name: 'Ember Pilot Org', users: 12, activePct: 0, days: 40, never: true },
  { name: 'Fresh Start Trials', users: 8, activePct: 0, days: 55, never: true },
  { name: 'Westgate Combined', users: 380, activePct: 86, days: 0 },
];

/**
 * Healthy multi-tenant platform: growth, daytime usage peak, mostly green health,
 * a couple of never-activated watchlist orgs.
 */
export const HEALTHY_PLATFORM_OWNER_DASHBOARD: PlatformOwnerDashboardMock = {
  institutions: {
    total: 48,
    trend: 'up',
    dataPoints: risingSeries(30, 38, 48, 0.03),
  },
  users: {
    total: 12_480,
    trend: 'up',
    dataPoints: risingSeries(30, 10_200, 12_480, 0.04),
  },
  modules: {
    total: 3_640,
    trend: 'up',
    dataPoints: risingSeries(30, 2_900, 3_640, 0.06),
  },
  totalCost: {
    total: 186_400,
    trend: 'up',
    dataPoints: risingSeries(30, 148_000, 186_400, 0.05),
  },
  averageProfit: {
    total: 42_800,
    trend: 'up',
    dataPoints: risingSeries(30, 28_000, 42_800, 0.08),
  },
  mostActiveInstitutions: {
    labels: Array.from({ length: 12 }, (_, i) => `W${i + 1}`),
    series: ORGS.slice(0, 6).map((org, index) => ({
      id: uuid(400 + index),
      label: org.name,
      data: risingSeries(12, 40 + index * 8, 90 + index * 18, 0.1),
    })),
  },
  profitMarginMonths: last6MonthLabels(),
  // Institution counts by profit-margin band (same 3-band chart as grades).
  profitMarginPerformance: [
    {
      label: 'Below 35%',
      data: [8, 7, 6, 5, 5, 4],
    },
    {
      label: 'Between 35 and 75%',
      data: [18, 17, 16, 15, 14, 13],
    },
    {
      label: 'Above 75%',
      data: [16, 19, 22, 25, 27, 29],
    },
  ],
  profitMarginTrends: {
    average: 28.6,
    color: 'success',
  },
  // School-day shape: quiet night, ramp 06–09, peak 10–14, evening homework bump
  peakUsageHours: Array.from({ length: 24 }, (_, hour) => {
    const school =
      hour < 5
        ? 12 + hour
        : hour < 8
          ? 40 + (hour - 5) * 35
          : hour < 15
            ? 180 + Math.sin((hour - 10) / 2) * 40
            : hour < 20
              ? 95 + (hour % 3) * 12
              : 35 + (24 - hour) * 4;
    return { hour, count: Math.round(school) };
  }),
  activeInstitutionsLast7Days: 39,
  activeInstitutionsLast30Days: 44,
  neverActivatedInstitutions: 2,
  institutionHealth: ORGS.map((org, index) => ({
    institutionId: uuid(500 + index),
    name: org.name,
    lastActiveAt: org.never ? null : daysAgoIso(org.days),
    totalUsers: org.users,
    activeUsersLast30Days: Math.round((org.users * org.activePct) / 100),
    activeUserPercent: org.activePct,
    neverActivated: Boolean(org.never),
  })),
};
