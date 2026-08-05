'use client';

import SegmentError from '@/app/dashboard/_components/SegmentError/SegmentError';

export default function InstitutionsError({
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
      title="Institutions unavailable"
      description="We could not load institutions. Please try again."
    />
  );
}
