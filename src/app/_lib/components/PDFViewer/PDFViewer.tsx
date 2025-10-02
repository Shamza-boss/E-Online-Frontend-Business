'use client';
import React, {
  useEffect,
  useMemo,
  useState,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import { Box, CircularProgress, Alert } from '@mui/material';
import PDFOutline from './PDFOutline';
import type { PDFDocumentProxy as ReactPDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import PDFControls from './PDFControls';
import { OutlinedWrapper } from '../shared-theme/customizations/OutlinedWrapper';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdfjs-dist/build/pdf.worker.mjs`;

interface PdfViewerProps {
  fileUrl: string;
  initialPage?: number;
  initialZoom?: number;
  showOutline?: boolean;
  onPageChange?: (page: number) => void;
  onZoomChange?: (zoom: number) => void;
  onOutlineChange?: (show: boolean) => void;
}

interface Highlight {
  pageNumber: number;
  content: string;
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

const highlightCursorStyle = {
  position: 'relative',
  cursor:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000000' d='M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37-1.34-1.34a.996.996 0 0 0-1.41 0L9 12.25 11.75 15l8.96-8.96a.996.996 0 0 0 0-1.41z'/%3E%3C/svg%3E\") 0 24, text",
  '& .react-pdf__Page__textContent': {
    cursor: 'inherit !important',
    '& *': {
      cursor: 'inherit !important',
    },
  },
  '& .react-pdf__Page__annotations': {
    cursor: 'inherit !important',
    '& *': {
      cursor: 'inherit !important',
    },
  },
} as const;

const getScaledPosition = (rect: DOMRect, container: HTMLElement) => {
  const containerRect = container.getBoundingClientRect();
  return {
    top: rect.top - containerRect.top,
    left: rect.left - containerRect.left,
    width: rect.width,
    height: rect.height,
  };
};

const PdfViewer: React.FC<PdfViewerProps> = ({
  fileUrl,
  initialPage = 1,
  initialZoom = 1,
  showOutline = false,
  onPageChange,
  onZoomChange,
  onOutlineChange,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(initialZoom);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [outline, setOutline] = useState<any[]>([]);
  const [pdfDocument, setPdfDocument] = useState<ReactPDFDocumentProxy | null>(
    null
  );
  const [showOutlineState, setShowOutlineState] = useState(showOutline);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    const savedHighlights = localStorage.getItem(`pdf-highlights-${fileUrl}`);
    if (savedHighlights) {
      setHighlights(JSON.parse(savedHighlights));
    }
  }, [fileUrl]);

  const documentOptions = useMemo(
    () => ({
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
      cMapPacked: true,
    }),
    []
  );

  useEffect(() => {
    const loadOutline = async () => {
      if (pdfDocument) {
        try {
          const outline = await pdfDocument.getOutline();
          if (outline && outline.length > 0) {
            setOutline(outline);
          }
        } catch (error) {
          console.error('Error loading outline:', error);
        }
      }
    };

    loadOutline();
  }, [pdfDocument]);

  useEffect(() => {
    onPageChange?.(pageNumber);
  }, [pageNumber, onPageChange]);

  useEffect(() => {
    onZoomChange?.(scale);
  }, [scale, onZoomChange]);

  useEffect(() => {
    onOutlineChange?.(showOutlineState);
  }, [showOutlineState, onOutlineChange]);

  const handleTextSelection = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!isHighlighting) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const content = selection.toString();

    // Get the text layer container
    const textLayer = event.currentTarget.querySelector(
      '.react-pdf__Page__textContent'
    );
    if (!textLayer) return;

    // Schedule highlight capture using requestIdleCallback or fallback
    const schedule = (fn: () => void) => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(fn);
      } else {
        setTimeout(fn, 50);
      }
    };

    schedule(() => {
      const rects = Array.from(range.getClientRects());
      if (rects.length === 0) return;

      // Get transform scale from text layer style
      const transform = window.getComputedStyle(textLayer).transform;
      let scaleFactor = scale;

      if (transform && transform !== 'none') {
        const match = transform.match(/^matrix\((.+)\)$/);
        if (match) {
          const matrixValues = match[1].split(',').map(parseFloat);
          if (matrixValues.length >= 1) {
            scaleFactor = matrixValues[0]; // scaleX
          }
        }
      }

      const containerRect = textLayer.getBoundingClientRect();

      const newHighlights = rects.map((rect) => {
        const top = (rect.top - containerRect.top) / scaleFactor;
        const left = (rect.left - containerRect.left) / scaleFactor;
        const width = rect.width / scaleFactor;
        const height = rect.height / scaleFactor;

        return {
          pageNumber,
          content,
          position: { top, left, width, height },
        };
      });

      setHighlights((prev) => {
        const updated = [...prev, ...newHighlights];
        localStorage.setItem(
          `pdf-highlights-${fileUrl}`,
          JSON.stringify(updated)
        );
        return updated;
      });

      selection.removeAllRanges();
    });
  };
  const clearHighlights = () => {
    setHighlights([]);
    localStorage.removeItem(`pdf-highlights-${fileUrl}`);
  };

  const renderHighlights = (pageNumber: number) => {
    return highlights
      .filter((highlight) => highlight.pageNumber === pageNumber)
      .map((highlight, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 0, 0.3)',
            top: `${highlight.position.top * scale}px`,
            left: `${highlight.position.left * scale}px`,
            width: `${highlight.position.width * scale}px`,
            height: `${highlight.position.height * scale}px`,
            pointerEvents: 'none',
            zIndex: 1,
            cursor: 'pointer',
          }}
          title={highlight.content}
        />
      ));
  };

  const onDocumentLoadSuccess = async (pdfDoc: any) => {
    setNumPages(pdfDoc.numPages);
    setPdfDocument(pdfDoc);

    try {
      // Load outline after document is fully loaded
      const outline = await pdfDoc.getOutline();
      if (outline && outline.length > 0) {
        const processedOutline = await Promise.all(
          outline.map(async (item: any) => {
            try {
              if (item.dest) {
                const dest =
                  typeof item.dest === 'string'
                    ? await pdfDoc.getDestination(item.dest)
                    : item.dest;

                if (dest && dest.length > 0) {
                  const pageRef = dest[0];
                  const pageIndex = await pdfDoc.getPageIndex(pageRef);
                  return {
                    ...item,
                    pageNumber: pageIndex + 1,
                  };
                }
              }
              return item;
            } catch (error) {
              console.error('Error processing outline item:', error);
              return item;
            }
          })
        );
        setOutline(processedOutline);
      }
    } catch (error) {
      console.error('Error loading outline:', error);
    }
  };

  const handleItemClick = async (item: any) => {
    if (!pdfDocument) return;
    try {
      setIsPageLoading(true);
      if (item.pageNumber) {
        // If we already processed the page number in the outline
        setPageNumber(item.pageNumber);
      } else if (typeof item.dest === 'string') {
        // Handle string destination
        const destination = await pdfDocument.getDestination(item.dest);
        if (destination) {
          const pageIndex = await pdfDocument.getPageIndex(destination[0]);
          setPageNumber(pageIndex + 1);
        }
      } else if (Array.isArray(item.dest)) {
        // Handle array destination
        const pageRef = item.dest[0];
        if (pageRef) {
          const pageIndex = await pdfDocument.getPageIndex(pageRef);
          setPageNumber(pageIndex + 1);
        }
      }
    } catch (error) {
      console.error('Error navigating to destination:', error);
      setIsPageLoading(false);
    }
  };

  const handleInternalClick = async (e: any) => {
    if (pdfDocument ? true : false) {
      console.error('PDF document not yet loaded');
      return;
    }

    try {
      setIsPageLoading(true);
      if (e.pageIndex !== undefined) {
        const newPage = e.pageIndex + 1;
        setPageNumber(newPage);
        return;
      }

      if (e.dest && Array.isArray(e.dest) && e.dest[0] && 'num' in e.dest[0]) {
        const newPage = e.dest[0].num + 1;
        console.log('Navigating to page:', newPage);
        setPageNumber(newPage);
        return;
      }
      setIsPageLoading(false);
    } catch (error) {
      console.error('Error handling internal link:', error);
      setIsPageLoading(false);
    }
  };

  const zoomIn = () => {
    setScale((prev) => prev + 0.2);
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const toggleOutline = () => {
    setShowOutlineState((prev) => !prev);
  };

  const scrollToTop = () => {
    const container = document.querySelector('.react-pdf__Page');
    if (container?.parentElement) {
      container.parentElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Debounced page change to prevent rapid updates
  const debouncedPageChange = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (newPage: number) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (newPage >= 1 && newPage <= (numPages || 1)) {
          setIsPageLoading(true);
          setPageNumber(newPage);
        }
      }, 100);
    };
  }, [numPages]);

  const handleNextPage = () => {
    if (pageNumber < (numPages || 1)) {
      setIsPageLoading(true);
      setPageNumber(pageNumber + 1);
      // Remove scrollToTop from here - let the page load first
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setIsPageLoading(true);
      setPageNumber(pageNumber - 1);
      // Remove scrollToTop from here - let the page load first
    }
  };

  const handleGoToPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(event.target.value, 10);
    if (!isNaN(page)) {
      debouncedPageChange(page);
    }
  };

  return (
    <Box display="flex" height={'100%'}>
      {showOutlineState && (
        <Box
          sx={{
            width: 300,
            borderRight: 1,
            borderColor: 'divider',
            overflow: 'auto',
            transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
            transform: showOutlineState ? 'translateX(0)' : 'translateX(-100%)',
            opacity: showOutlineState ? 1 : 0,
            position: 'relative',
            backgroundColor: 'background.paper',
            zIndex: 1,
          }}
        >
          <PDFOutline outline={outline} onNavigate={handleItemClick} />
        </Box>
      )}
      <Box
        display="flex"
        flexDirection="column"
        height="100%" // Take full height of parent
        width="100%"
        overflow="hidden" // Prevent outer overflow
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding={1}
          borderBottom="1px solid"
          borderColor="divider"
        >
          <PDFControls
            numPages={numPages}
            pageNumber={pageNumber}
            isHighlighting={isHighlighting}
            hasHighlights={highlights.length > 0}
            onToggleOutline={toggleOutline}
            onZoomOut={zoomOut}
            onZoomIn={zoomIn}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onPageChange={handleGoToPage}
            onToggleHighlight={() => setIsHighlighting(!isHighlighting)}
            onClearHighlights={clearHighlights}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden', // clip anything outside
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Loading overlay */}
          {isPageLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'opacity 0.2s ease-in-out',
              }}
            >
              <CircularProgress size="2rem" />
            </Box>
          )}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                overflow: 'auto',
                display: 'grid',
                placeItems: 'center',
                scrollBehavior: 'smooth', // Add smooth scrolling
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: (theme) => theme.palette.divider,
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: (theme) => theme.palette.action.hover,
                },
              }}
            >
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onItemClick={handleInternalClick}
                onLoadError={(error) =>
                  console.error('Error loading document:', error)
                }
                options={documentOptions}
                key={fileUrl} // Add key to prevent remounting issues
                noData={
                  <Alert variant="filled" severity="error">
                    There was an issue retrieving the PDF 😓. Please contact
                    your class Administrator for assistance.
                  </Alert>
                }
                loading={
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                  >
                    <CircularProgress size="3rem" />
                  </Box>
                }
              >
                <Box
                  onMouseUp={handleTextSelection}
                  sx={
                    isHighlighting
                      ? highlightCursorStyle
                      : { position: 'relative' }
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderAnnotationLayer={true}
                    renderTextLayer={true}
                    onLoadSuccess={() => {
                      setTimeout(() => {
                        setIsPageLoading(false);
                        setTimeout(() => scrollToTop(), 50);
                      }, 150);
                    }}
                    onLoadError={(error) => {
                      console.error('Error loading page:', error);
                      setIsPageLoading(false);
                    }}
                    loading={
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        height="400px"
                        sx={{
                          backgroundColor: 'background.paper',
                          opacity: isPageLoading ? 1 : 0,
                          transition: 'opacity 0.2s ease-in-out',
                        }}
                      >
                        <CircularProgress size="2rem" />
                      </Box>
                    }
                  >
                    {renderHighlights(pageNumber)}
                  </Page>
                </Box>
              </Document>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(PdfViewer);
