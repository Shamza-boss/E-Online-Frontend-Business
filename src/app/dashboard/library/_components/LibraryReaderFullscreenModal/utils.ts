export function buildCourseUrl(classroom: { id: string; name: string }): string {
  return `/dashboard/courses/${encodeURIComponent(`${classroom.name}~${classroom.id}`)}`;
}

export function getPdfStateStorageKey(fileId: string): string {
  return `library-pdf-state-${fileId}`;
}

export function readStoredPage(storageKey: string): number {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return 1;
    const parsed = JSON.parse(raw) as { page?: number };
    return typeof parsed.page === 'number' && parsed.page > 0 ? parsed.page : 1;
  } catch {
    return 1;
  }
}

export function writeStoredPage(storageKey: string, page: number): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({ page }));
  } catch {
    // ignore
  }
}
