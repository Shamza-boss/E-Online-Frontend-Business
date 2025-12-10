import { Question } from '../interfaces/types';

const parseDisplaySegments = (displayOrder?: string): number[] | null => {
  if (!displayOrder) return null;
  const segments = displayOrder
    .split('.')
    .map((segment) => Number(segment))
    .filter((value) => Number.isFinite(value));
  return segments.length > 0 ? segments : null;
};

const compareDisplayOrder = (a?: string, b?: string): number => {
  if (!a && !b) {
    return 0;
  }
  if (!a) {
    return 1;
  }
  if (!b) {
    return -1;
  }

  const segmentsA = parseDisplaySegments(a) ?? [];
  const segmentsB = parseDisplaySegments(b) ?? [];
  const maxLength = Math.max(segmentsA.length, segmentsB.length);

  for (let i = 0; i < maxLength; i += 1) {
    const diff = (segmentsA[i] ?? 0) - (segmentsB[i] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
};

const cloneWithSortedChildren = (question: Question): Question => {
  if (!question.subquestions || question.subquestions.length === 0) {
    return question;
  }

  return {
    ...question,
    subquestions: sortQuestionTreeByDisplayOrder(question.subquestions),
  };
};

export const sortQuestionTreeByDisplayOrder = (
  questions: Question[]
): Question[] => {
  if (!Array.isArray(questions)) {
    return [];
  }

  return [...questions]
    .map((question, index) => ({
      question: cloneWithSortedChildren(question),
      originalIndex: index,
    }))
    .sort((a, b) => {
      const orderDiff = compareDisplayOrder(
        a.question.displayOrder,
        b.question.displayOrder
      );

      if (orderDiff !== 0) {
        return orderDiff;
      }

      return a.originalIndex - b.originalIndex;
    })
    .map(({ question }) => question);
};
