import { useCallback, useMemo, useState } from 'react';

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
}

export const DEFAULT_SPLIT_SIZES: [number, number] = [35, 65];

export const useClassroomLayout = (options: UseClassroomLayoutOptions = {}) => {
  const { initialSplitSizes = DEFAULT_SPLIT_SIZES } = options;

  const [tabValue, setTabValue] = useState('1');
  const [isNotesOpen, setNotesOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [outline, setOutline] = useState(false);
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
