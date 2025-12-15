import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface PdfViewState {
  currentPage: number;
  zoom: number;
  outline: boolean;
  onPageChange: (page: number) => void;
  onZoomChange: (zoom: number) => void;
  onOutlineChange: (show: boolean) => void;
}

interface UseClassroomLayoutOptions {
  initialSplitSizes?: [number, number];
  pdfPersistKey?: string;
}

interface PersistedPdfState {
  page: number;
  zoom: number;
  outline: boolean;
}

export const DEFAULT_SPLIT_SIZES: [number, number] = [35, 65];

export const useClassroomLayout = (options: UseClassroomLayoutOptions = {}) => {
  const { initialSplitSizes = DEFAULT_SPLIT_SIZES, pdfPersistKey } = options;
  const storageKey = pdfPersistKey
    ? `classroom-pdf-state-${pdfPersistKey}`
    : null;

  const readPersistedPdfState = (): PersistedPdfState => {
    const defaults: PersistedPdfState = {
      page: 1,
      zoom: 1,
      outline: false,
    };

    if (typeof window === 'undefined' || !storageKey) {
      return defaults;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return defaults;
      }
      const parsed = JSON.parse(raw) as Partial<PersistedPdfState>;
      return {
        page:
          typeof parsed.page === 'number' && parsed.page > 0
            ? parsed.page
            : defaults.page,
        zoom:
          typeof parsed.zoom === 'number' && parsed.zoom > 0
            ? parsed.zoom
            : defaults.zoom,
        outline:
          typeof parsed.outline === 'boolean'
            ? parsed.outline
            : defaults.outline,
      };
    } catch (error) {
      console.warn('Failed to read persisted PDF state', error);
      return defaults;
    }
  };

  const initialPdfStateRef = useRef<PersistedPdfState | null>(null);
  if (initialPdfStateRef.current === null) {
    initialPdfStateRef.current = readPersistedPdfState();
  }
  const initialPdfState = initialPdfStateRef.current;

  const [tabValue, setTabValue] = useState('1');
  const [isNotesOpen, setNotesOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPdfState.page);
  const [zoom, setZoom] = useState(initialPdfState.zoom);
  const [outline, setOutline] = useState(initialPdfState.outline);
  const [splitSizes, setSplitSizes] = useState<number[] | undefined>();

  const toggleNotes = useCallback(() => {
    setNotesOpen((prev) => !prev);
  }, []);

  const openNotes = useCallback(() => setNotesOpen(true), []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => {
      if (!prev && !isNotesOpen) {
        openNotes();
      }
      return !prev;
    });
  }, [isNotesOpen, openNotes]);

  const exitFullscreen = useCallback(() => setIsFullscreen(false), []);

  const handleSplitResizeFinished = useCallback(
    (_gutterIdx: number, sizes: number[]) => {
      setSplitSizes(sizes);
    },
    []
  );

  const appliedSplitSizes = useMemo(
    () => splitSizes ?? initialSplitSizes,
    [splitSizes, initialSplitSizes]
  );

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') {
      return;
    }

    const nextState = readPersistedPdfState();
    setCurrentPage(nextState.page);
    setZoom(nextState.zoom);
    setOutline(nextState.outline);
    initialPdfStateRef.current = nextState;
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') {
      return;
    }

    const payload: PersistedPdfState = {
      page: currentPage,
      zoom,
      outline,
    };

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (error) {
      console.warn('Failed to persist PDF state', error);
    }
  }, [storageKey, currentPage, zoom, outline]);

  const pdfState: PdfViewState = useMemo(
    () => ({
      currentPage,
      zoom,
      outline,
      onPageChange: setCurrentPage,
      onZoomChange: setZoom,
      onOutlineChange: setOutline,
    }),
    [currentPage, zoom, outline]
  );

  return {
    tabValue,
    setTabValue,
    isNotesOpen,
    toggleNotes,
    isFullscreen,
    toggleFullscreen,
    exitFullscreen,
    pdfState,
    splitSizes: appliedSplitSizes,
    onSplitResizeFinished: handleSplitResizeFinished,
  };
};
