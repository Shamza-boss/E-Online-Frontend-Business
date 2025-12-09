import useSWR from 'swr';
import {
  getInstitutionBilling,
  getInstitutionBillingHistory,
  getInstitutionProjection,
  getInstitutionRates,
} from '../actions/subscriptions';
import {
  BillingProjectionDto,
  BillingRateDto,
  BillingSummaryDto,
} from '../interfaces/types';

export function useInstitutionBilling(institutionId?: string) {
  return useSWR<BillingSummaryDto>(
    institutionId ? ['institution-billing', institutionId] : null,
    () => getInstitutionBilling(institutionId as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: Number.POSITIVE_INFINITY,
    }
  );
}

export function useInstitutionBillingHistory(institutionId?: string) {
  return useSWR<BillingSummaryDto[]>(
    institutionId ? ['institution-billing-history', institutionId] : null,
    () => getInstitutionBillingHistory(institutionId as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: Number.POSITIVE_INFINITY,
      keepPreviousData: true,
    }
  );
}

export function useInstitutionRates(institutionId?: string) {
  return useSWR<BillingRateDto | null>(
    institutionId ? ['institution-billing-rates', institutionId] : null,
    () => getInstitutionRates(institutionId as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: Number.POSITIVE_INFINITY,
    }
  );
}

export function useInstitutionProjection(
  institutionId?: string,
  params?: { year?: number; month?: number }
) {
  return useSWR<BillingProjectionDto>(
    institutionId
      ? [
          'institution-billing-projection',
          institutionId,
          params?.year,
          params?.month,
        ]
      : null,
    () => getInstitutionProjection(institutionId as string, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: Number.POSITIVE_INFINITY,
    }
  );
}
