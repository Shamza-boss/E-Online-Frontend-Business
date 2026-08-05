import useSWR from 'swr';
import {
  getInstitutionBilling,
  getInstitutionBillingHistory,
  getInstitutionProjection,
} from '../actions/subscriptions';
import {
  type BillingProjectionDto,
  type BillingSummaryDto,
} from '../interfaces/types';
import { swrKeys } from '../config/swrKeys';

export function useInstitutionBilling(institutionId?: string) {
  return useSWR<BillingSummaryDto>(
    institutionId ? swrKeys.institutionBilling(institutionId) : null,
    () => getInstitutionBilling(institutionId as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: Number.POSITIVE_INFINITY,
    },
  );
}

export function useInstitutionBillingHistory(institutionId?: string) {
  return useSWR<BillingSummaryDto[]>(
    institutionId ? swrKeys.institutionBillingHistory(institutionId) : null,
    () => getInstitutionBillingHistory(institutionId as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: Number.POSITIVE_INFINITY,
      keepPreviousData: true,
    },
  );
}

export function useInstitutionProjection(
  institutionId?: string,
  params?: { year?: number; month?: number },
) {
  return useSWR<BillingProjectionDto>(
    institutionId
      ? swrKeys.institutionBillingProjection(
          institutionId,
          params?.year,
          params?.month,
        )
      : null,
    () => getInstitutionProjection(institutionId as string, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: Number.POSITIVE_INFINITY,
    },
  );
}
