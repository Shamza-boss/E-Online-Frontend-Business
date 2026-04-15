import { usdToZarRate, numberFormat } from './constants';
import type { BillingProjectionDto } from '@/app/_lib/interfaces/types';

export const convertUsdToZar = (value: number) => value * usdToZarRate;

export const formatStorageVolume = (gigabytes: number) => {
  if (!Number.isFinite(gigabytes) || gigabytes <= 0) {
    return '0 MB';
  }
  const megabytes = gigabytes * 1024;
  if (megabytes < 1024) {
    return `${Number(megabytes.toFixed(1))} MB`;
  }
  return `${Number(gigabytes.toFixed(5))} GB`;
};

export function buildUsageMetrics(projection: BillingProjectionDto) {
  return [
    { label: 'Users', value: projection.usage.userCount.toLocaleString() },
    {
      label: 'Stored minutes',
      value: `${numberFormat.format(projection.usage.storedVideoMinutes)} min`,
    },
    {
      label: 'Delivered minutes',
      value: `${numberFormat.format(projection.usage.deliveredVideoMinutes)} min`,
    },
    {
      label: 'PDF storage',
      value: formatStorageVolume(projection.usage.pdfStorageGb),
    },
    {
      label: 'PDF downloads',
      value: numberFormat.format(projection.usage.pdfDownloads),
    },
  ];
}

export function buildCostBreakdown(projection: BillingProjectionDto) {
  return [
    {
      label: 'Cloudflare storage',
      value: convertUsdToZar(projection.costsUsd.cloudflareStoredUsd),
    },
    {
      label: 'Cloudflare delivery',
      value: convertUsdToZar(projection.costsUsd.cloudflareDeliveredUsd),
    },
    {
      label: 'Railway CPU',
      value: convertUsdToZar(projection.costsUsd.railwayCpuUsd),
    },
    {
      label: 'Railway memory',
      value: convertUsdToZar(projection.costsUsd.railwayMemoryUsd),
    },
    {
      label: 'Railway volume',
      value: convertUsdToZar(projection.costsUsd.railwayVolumeUsd),
    },
    {
      label: 'Railway egress',
      value: convertUsdToZar(projection.costsUsd.railwayEgressUsd),
    },
    {
      label: 'Railway object storage',
      value: convertUsdToZar(projection.costsUsd.railwayObjectStorageUsd),
    },
  ];
}
