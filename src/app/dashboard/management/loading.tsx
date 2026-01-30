/**
 * Management page loading state
 * 
 * We return null here to allow the page to render immediately with its
 * structure (header, tabs, buttons). The DataGrid components have their
 * own built-in loading states that show a linear progress indicator
 * while data is being fetched via SWR.
 * 
 * This provides a better UX than a full-page skeleton because:
 * 1. Users see the page structure immediately
 * 2. They can interact with tabs and buttons while data loads
 * 3. The loading state is localized to just the data area
 */
export default function ManagementLoading() {
    return null;
}
