export type HighlightRecord = {
  fileUrl: string;
  highlights: Highlight[];
  updatedAt: number;
};

export type Highlight = {
  pageNumber: number;
  content: string;
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
};

const DB_NAME = 'eonline-pdf';
const DB_VERSION = 1;
const STORE_NAME = 'highlights';
const MAX_HIGHLIGHTS_PER_FILE = 500;

let dbPromise: Promise<IDBDatabase> | null = null;

const openHighlightDb = (): Promise<IDBDatabase> => {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available in this environment'));
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'fileUrl' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
  });

  return dbPromise;
};

const withStore = async <T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore, resolve: (value: T) => void, reject: (reason?: unknown) => void) => void
): Promise<T> => {
  const db = await openHighlightDb();

  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);

    action(store, resolve, reject);

    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
  });
};

export const getHighlights = async (fileUrl: string): Promise<Highlight[]> => {
  try {
    const record = await withStore<HighlightRecord | null>('readonly', (store, resolve, reject) => {
      const req = store.get(fileUrl);
      req.onsuccess = () => resolve((req.result as HighlightRecord | undefined) ?? null);
      req.onerror = () => reject(req.error ?? new Error('Failed to read highlights'));
    });
    return record?.highlights ?? [];
  } catch {
    return [];
  }
};

export const setHighlights = async (fileUrl: string, highlights: Highlight[]): Promise<void> => {
  try {
    const capped = highlights.slice(-MAX_HIGHLIGHTS_PER_FILE);
    await withStore<void>('readwrite', (store, resolve, reject) => {
      const req = store.put({
        fileUrl,
        highlights: capped,
        updatedAt: Date.now(),
      } satisfies HighlightRecord);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error ?? new Error('Failed to write highlights'));
    });
  } catch {
    // silently fail — highlights are non-critical
  }
};

export const removeHighlights = async (fileUrl: string): Promise<void> => {
  try {
    await withStore<void>('readwrite', (store, resolve, reject) => {
      const req = store.delete(fileUrl);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error ?? new Error('Failed to delete highlights'));
    });
  } catch {
    // no-op
  }
};

/**
 * Migrate any existing localStorage highlight entries into IndexedDB
 * and remove them from localStorage. Called once on first load.
 */
export const migrateLocalStorageHighlights = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith('pdf-highlights-')) continue;

      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const fileUrl = key.replace('pdf-highlights-', '');
      // Normalize: strip query params for the storage key
      const normalized = normalizeStorageKey(fileUrl);

      try {
        const parsed = JSON.parse(raw) as Highlight[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          await setHighlights(normalized, parsed);
        }
      } catch {
        // skip malformed entries
      }

      keysToRemove.push(key);
    }

    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  } catch {
    // migration is best-effort
  }
};

/**
 * Normalize a file URL to strip query parameters (signed URL tokens etc.)
 * so that the same file always maps to the same storage key.
 */
export const normalizeStorageKey = (value: string): string => {
  try {
    const base =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'http://localhost';
    const url = new URL(value, base);
    return `${url.origin}${url.pathname}`;
  } catch {
    return value;
  }
};
