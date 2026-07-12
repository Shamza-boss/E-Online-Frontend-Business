'use client';

import SegmentError from '@/app/dashboard/_components/SegmentError/SegmentError';

export default function LibraryError({
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
      title="Library unavailable"
      description="We could not load the library. Please try again."
    />
  );
}
