/**
 * OpenAPI schema aliases — wire shapes from the backend contract.
 *
 * Regenerate: `npm run generate:api-types`
 * Contract: `contracts/openapi.v1.json` (vendored from E-Online-Backend-Business)
 *
 * Swashbuckle leaves most properties optional; `AppDto` deep-requires them for
 * app code while still deriving property names/types from the generated schema.
 */
import type { components } from './generated/schema';

export type ApiSchemas = components['schemas'];

type DeepNonNullable<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer U)[]
    ? DeepNonNullable<U>[]
    : T extends object
      ? { [K in keyof T]-?: DeepNonNullable<Exclude<T[K], null | undefined>> }
      : T;

/** App-facing DTO: required fields derived from an OpenAPI schema name. */
export type AppDto<K extends keyof ApiSchemas> = DeepNonNullable<ApiSchemas[K]>;

export type SystemAdminDashboardDto = AppDto<'SystemAdminDashboardDto'>;
export type PlatformOwnerDashboardDto = AppDto<'PlatformOwnerDashboardDto'>;
export type InstitutionBillingDashboardDto =
  AppDto<'InstitutionBillingDashboardDto'>;
export type BillingUsageMetricsDto = AppDto<'BillingUsageMetricsDto'>;

/** OpenAPI name (singular Trend). */
export type InstitutionTrendDashboardDto = AppDto<'InstitutionTrendDashboardDto'>;

/** FE alias kept for existing imports. */
export type InstitutionTrendsDashboardDto = InstitutionTrendDashboardDto;

export type TrendMetricDto = AppDto<'TrendMetricDto'>;
export type HourlyLoginStat = AppDto<'HourlyLoginStat'>;
export type GradePerformanceDto = AppDto<'GradePerformanceDto'>;
/** Legacy misspelling — prefer GradePerformanceDto. */
export type GradePerfomanceDto = GradePerformanceDto;
export type GradePerformanceLableTrendDto =
  AppDto<'GradePerformanceLableTrendDto'>;
export type MostActiveClassSubjectSeriesDto =
  AppDto<'MostActiveClassSubjectSeriesDto'>;
export type MostActiveInstitutionSeriesDto =
  AppDto<'MostActiveInstitutionSeriesDto'>;
export type InstitutionActivitySeries = AppDto<'InstitutionActivitySeries'>;
export type SubjectSeries = AppDto<'SubjectSeries'>;
export type RecentHomeworkStatDto = AppDto<'RecentHomeworkStatDto'>;
export type EngagementStatDto = AppDto<'EngagementStatDto'>;
export type InactiveUserSummaryDto = AppDto<'InactiveUserSummaryDto'>;
