'use client';

import SegmentError from '@/app/dashboard/_components/SegmentError/SegmentError';

export default function ManagementError({
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
      title="Management unavailable"
      description="We could not load management data. Please try again."
    />
  );
}
