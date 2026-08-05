'use client';

import SegmentError from '@/app/dashboard/_components/SegmentError/SegmentError';

export default function DashboardError({
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
      title="Something went wrong"
      description="We could not load this dashboard page. Please try again."
    />
  );
}
