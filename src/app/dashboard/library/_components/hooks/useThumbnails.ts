'use client';

import { useEffect, useState } from 'react';
import { FileDto } from '@/app/_lib/interfaces/types';
import { generatePdfThumbnail } from '@/app/_lib/utils/pdfThumbnail';

const extractName = (fileKey: string) => {
  return fileKey.split('_').pop() ?? fileKey;
};

export const useThumbnails = (files: FileDto[]) => {
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [loadingThumbnails, setLoadingThumbnails] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    async function generateMissingThumbnails() {
      if (!files.length) return;
      const newThumbs: Record<string, string> = {};
      await Promise.all(
        files.map(async (file) => {
          if (!thumbnails[file.id]) {
            try {
              const response = await fetch(file.url);
              const blob = await response.blob();
              const pdfFile = new File(
                [blob],
                file.fileName || extractName(file.fileKey),
                { type: blob.type }
              );
              const thumb = await generatePdfThumbnail(pdfFile, 500, 560);
              newThumbs[file.id] = thumb;
            } catch {}
          }
        })
      );
      if (Object.keys(newThumbs).length > 0)
        setThumbnails((prev) => ({ ...prev, ...newThumbs }));
    }
    generateMissingThumbnails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.map((f) => f.id).join(','), files.map((f) => f.url).join(',')]);

  return { thumbnails, loadingThumbnails };
};
