import type { Question } from '../../../../../_lib/interfaces/types';
import type { PdfPreviewState } from './interfaces';

/** Format byte count to a human-readable size string */
export const formatFileSize = (bytes?: number | null): string | null => {
  if (!bytes || bytes <= 0) return null;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  }
  return `${(bytes / 1024).toFixed(1)} KB`;
};

/** Recursively compute total weight of a question tree */
export const computeTotalWeight = (node: Question): number => {
  if (node.subquestions && node.subquestions.length > 0) {
    return node.subquestions.reduce(
      (sum, sub) => sum + computeTotalWeight(sub),
      0
    );
  }
  return Number.isFinite(node.weight) ? Number(node.weight) : 0;
};

/** Build a PdfPreviewState from a question's PDF attachment */
export const buildPdfPreview = (
  fallbackTitle: string,
  pdf?: Question['pdf']
): PdfPreviewState | null => {
  if (!pdf?.url) return null;
  return {
    title: pdf.title || fallbackTitle || 'PDF Document',
    url: pdf.url,
    key: pdf.key,
  };
};
