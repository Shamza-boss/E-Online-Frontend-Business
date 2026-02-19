import {
  BillingProjectionDto,
  BillingRateDto,
  BillingSummaryDto,
} from '../interfaces/types';
import { serverFetch } from '../serverFetch';

const SUBSCRIPTION_BASE = '/subscriptions';

const subscriptionPath = (institutionId: string, suffix: string = '') =>
  `${SUBSCRIPTION_BASE}/${encodeURIComponent(institutionId)}${suffix}`;

type ProjectionQuery = {
  year?: number;
  month?: number;
};

export async function getInstitutionBilling(
  institutionId: string
): Promise<BillingSummaryDto> {
  return serverFetch<BillingSummaryDto>(subscriptionPath(institutionId), {
    method: 'GET',
  });
}

export async function getInstitutionBillingHistory(
  institutionId: string
): Promise<BillingSummaryDto[]> {
  return serverFetch<BillingSummaryDto[]>(
    subscriptionPath(institutionId, '/history'),
    {
      method: 'GET',
    }
  );
}

export async function setCreatorAddon(
  institutionId: string,
  payload: BillingRateDto
): Promise<void> {
  await serverFetch<void>(subscriptionPath(institutionId, '/creator'), {
    method: 'PATCH',
    body: payload,
  });
}

export async function getInstitutionProjection(
  institutionId: string,
  params?: ProjectionQuery
): Promise<BillingProjectionDto> {
  const search = new URLSearchParams();
  if (typeof params?.year === 'number') {
    search.set('year', String(params.year));
  }
  if (typeof params?.month === 'number') {
    search.set('month', String(params.month));
  }

  const suffix = `/projection${search.toString() ? `?${search.toString()}` : ''}`;

  return serverFetch<BillingProjectionDto>(
    subscriptionPath(institutionId, suffix),
    {
      method: 'GET',
    }
  );
}
