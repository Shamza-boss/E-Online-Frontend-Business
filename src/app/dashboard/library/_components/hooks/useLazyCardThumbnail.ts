'use client';

import { useEffect, useRef, useState } from 'react';
import { FileDto } from '@/app/_lib/interfaces/types';
import { generatePdfThumbnail } from '@/app/_lib/utils/pdfThumbnail';
import { extractTextbookName } from '@/app/_lib/utils/textbook';

/**
 * Lazily generates PDF thumbnails only when a card enters the viewport.
 * Prefers previewImageUrl from the API when available.
 */
export function useLazyCardThumbnail(file: FileDto) {
  const [thumbnail, setThumbnail] = useState<string | null>(
    file.previewImageUrl ?? null
  );
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const generatedRef = useRef(false);

  useEffect(() => {
    if (!file.id || !file.url) return;

    if (file.previewImageUrl) {
      setThumbnail(file.previewImageUrl);
      return;
    }

    const node = ref.current;
    if (!node || generatedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || generatedRef.current) return;

        generatedRef.current = true;
        setIsLoading(true);

        void (async () => {
          try {
            const response = await fetch(file.url);
            const blob = await response.blob();
            const pdfFile = new File(
              [blob],
              file.fileName || extractTextbookName(file),
              { type: blob.type || 'application/pdf' }
            );
            const thumb = await generatePdfThumbnail(pdfFile, 500, 560);
            setThumbnail(thumb);
          } catch {
            setThumbnail(null);
          } finally {
            setIsLoading(false);
          }
        })();
      },
      { rootMargin: '100px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [file.id, file.url, file.previewImageUrl, file.fileName, file.fileKey]);

  return { ref, thumbnail, isLoading };
}
