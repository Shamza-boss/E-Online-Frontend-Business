'use client';

import SegmentError from '@/app/dashboard/_components/SegmentError/SegmentError';

export default function ManageCoursesError({
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
      title="Course management unavailable"
      description="We could not load course management. Please try again."
    />
  );
}
