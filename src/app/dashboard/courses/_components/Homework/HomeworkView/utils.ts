import type {
  Question,
  SubmittedHomework,
  Homework,
} from '../../../../../_lib/interfaces/types';
import type { PdfPreviewState } from './interfaces';
import { COVER_PAGE } from './constants';

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
    return node.subquestions.reduce((s, sub) => s + computeTotalWeight(sub), 0);
  }
  return Number.isFinite(node.weight) ? node.weight : 0;
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

/** Check if a value constitutes an answered question */
export const isAnsweredValue = (value: unknown): boolean => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== undefined && value !== null;
};

/** Check if a question node (and all sub-nodes) are completed */
export const isNodeCompleted = (
  node: Question,
  answers: Record<string, any>
): boolean => {
  if (node.subquestions && node.subquestions.length > 0) {
    return node.subquestions.every((sub) => isNodeCompleted(sub, answers));
  }
  return isAnsweredValue(answers[node.id]);
};

/** Update an answer in the answers map (returns new map) */
export const updateAnswer = (
  prev: Record<string, any>,
  questionId: string,
  value: any
): Record<string, any> => ({
  ...prev,
  [questionId]: value,
});

/** Toggle a multi-select option */
export const toggleMultiSelectOption = (
  currentAnswers: Record<string, any>,
  questionId: string,
  option: string,
  checked: boolean
): Record<string, any> => {
  const prev = Array.isArray(currentAnswers[questionId])
    ? (currentAnswers[questionId] as string[])
    : [];
  const next = checked
    ? [...prev, option]
    : prev.filter((item) => item !== option);
  return updateAnswer(currentAnswers, questionId, next);
};

/** Determine if the user has started the assessment */
export const hasAssessmentStarted = (
  answers: Record<string, any>,
  currentPage: number
): boolean => Object.keys(answers).length > 0 || currentPage !== COVER_PAGE;

/** Compute completion stats */
export const computeCompletionStats = (
  sortedQuestions: Question[],
  answers: Record<string, any>
): { answeredCount: number; completionPercent: number } => {
  const answeredCount = sortedQuestions.filter((q) =>
    isNodeCompleted(q, answers)
  ).length;
  const total = sortedQuestions.length;
  const completionPercent =
    total > 0 ? Math.round((answeredCount / total) * 100) : 0;
  return { answeredCount, completionPercent };
};
