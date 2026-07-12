'use client';

import SegmentError from '@/app/dashboard/_components/SegmentError/SegmentError';

export default function BillingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SegmentError
      error={error}
      reset={reset}
      title="Billing unavailable"
      description="We could not load billing. Please try again."
    />
  );
}
