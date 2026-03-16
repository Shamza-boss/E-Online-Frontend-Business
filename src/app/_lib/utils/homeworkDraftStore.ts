export type HomeworkDraftRecord = {
  key: string;
  homework: object;
  currentQuestionIndex: number;
  updatedAt: number;
};

const DB_NAME = 'eonline-homework';
const DB_VERSION = 1;
const STORE_NAME = 'drafts';

let dbPromise: Promise<IDBDatabase> | null = null;

const openDraftDb = (): Promise<IDBDatabase> => {
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
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
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
  const db = await openDraftDb();

  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);

    action(store, resolve, reject);

    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
  });
};

export const getHomeworkDraft = async (key: string): Promise<HomeworkDraftRecord | null> => {
  try {
    return await withStore<HomeworkDraftRecord | null>('readonly', (store, resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as HomeworkDraftRecord | undefined) ?? null);
      req.onerror = () => reject(req.error ?? new Error('Failed to read homework draft'));
    });
  } catch {
    return null;
  }
};

export const setHomeworkDraft = async (record: HomeworkDraftRecord): Promise<void> => {
  try {
    await withStore<void>('readwrite', (store, resolve, reject) => {
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error ?? new Error('Failed to write homework draft'));
    });
  } catch {
    // silently fail — drafts are non-critical
  }
};

export const removeHomeworkDraft = async (key: string): Promise<void> => {
  try {
    await withStore<void>('readwrite', (store, resolve, reject) => {
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error ?? new Error('Failed to delete homework draft'));
    });
  } catch {
    // no-op
  }
};

/**
 * Migrate existing localStorage homework draft entries into IndexedDB
 * and remove them from localStorage. Called once on first load.
 */
export const migrateLocalStorageDrafts = async (
  keys: string[]
): Promise<Map<string, HomeworkDraftRecord>> => {
  const results = new Map<string, HomeworkDraftRecord>();

  if (typeof window === 'undefined') return results;

  for (const storageKey of keys) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) continue;

      const parsed = JSON.parse(raw);

      const record: HomeworkDraftRecord = {
        key: storageKey,
        homework: parsed?.homework ?? parsed,
        currentQuestionIndex: parsed?.currentQuestionIndex ?? 0,
        updatedAt: Date.now(),
      };

      await setHomeworkDraft(record);
      results.set(storageKey, record);
      localStorage.removeItem(storageKey);
    } catch {
      // skip malformed entries
    }
  }

  return results;
};
