export type NoteDraftRecord = {
  noteId: string;
  content: string;
  updatedAt: number;
  noteUpdatedAt?: string;
};

const DB_NAME = 'eonline-editor';
const DB_VERSION = 1;
const STORE_NAME = 'noteDrafts';

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
        db.createObjectStore(STORE_NAME, { keyPath: 'noteId' });
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

export const getNoteDraft = async (noteId: string): Promise<NoteDraftRecord | null> => {
  try {
    return await withStore<NoteDraftRecord | null>('readonly', (store, resolve, reject) => {
      const req = store.get(noteId);
      req.onsuccess = () => resolve((req.result as NoteDraftRecord | undefined) ?? null);
      req.onerror = () => reject(req.error ?? new Error('Failed to read note draft'));
    });
  } catch {
    return null;
  }
};

export const setNoteDraft = async (record: NoteDraftRecord): Promise<void> => {
  try {
    await withStore<void>('readwrite', (store, resolve, reject) => {
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error ?? new Error('Failed to write note draft'));
    });
  } catch {
    // no-op
  }
};

export const removeNoteDraft = async (noteId: string): Promise<void> => {
  try {
    await withStore<void>('readwrite', (store, resolve, reject) => {
      const req = store.delete(noteId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error ?? new Error('Failed to delete note draft'));
    });
  } catch {
    // no-op
  }
};
