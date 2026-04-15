import type { Question } from '@/app/_lib/interfaces/types';

export const getTomorrowDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const computeTotalWeight = (question: Question): number => {
  if (question.subquestions && question.subquestions.length > 0) {
    return question.subquestions.reduce(
      (total, sub) => total + computeTotalWeight(sub),
      0
    );
  }
  return question.weight;
};
