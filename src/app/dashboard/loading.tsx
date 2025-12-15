import MainGridSkeleton from './_components/_skeletonLoaders/maingridLoader';
import PageSkeleton from './_components/_skeletonLoaders/PageSkeleton';

/**
 * Loading UI shown during Next.js navigation and compilation
 * This handles the loading state when:
 * - Navigating between dashboard routes
 * - Next.js is compiling pages in development
 * - Server components are being fetched
 */
export default function DashboardLoading() {
    return <MainGridSkeleton />;
}
