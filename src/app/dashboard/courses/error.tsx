'use client';

import SegmentError from '@/app/dashboard/_components/SegmentError/SegmentError';

export default function CoursesError({
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
      title="Courses unavailable"
      description="We could not load your courses. Please try again."
    />
  );
}
