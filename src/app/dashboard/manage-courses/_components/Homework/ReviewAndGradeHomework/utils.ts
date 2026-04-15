import type { Question } from '@/app/_lib/interfaces/types';
import type { GradingData, GradingEntry } from './interfaces';

export const getGradeBorder = (award: number, max: number): string => {
  if (award === 0) return 'red';
  if (award < max) return 'orange';
  if (award >= max) return 'green';
  return 'transparent';
};

export const computeGradingUpdate = (
  prev: GradingData,
  questionId: string,
  newData: Partial<GradingEntry>,
  questions: Question[]
): GradingData => {
  const current = prev[questionId] || { grade: 0, comment: '' };
  let nextGrade = newData.grade !== undefined ? newData.grade : current.grade;

  const findWeight = (qs: Question[], id: string): number | null => {
    for (const q of qs) {
      if (q.id === id) return q.weight;
      if (q.subquestions?.length) {
        const sub = findWeight(q.subquestions, id);
        if (sub !== null) return sub;
      }
    }
    return null;
  };

  const maxWeight = findWeight(questions, questionId) || Infinity;
  if (nextGrade > maxWeight) nextGrade = maxWeight;

  return {
    ...prev,
    [questionId]: {
      grade: nextGrade,
      comment:
        newData.comment !== undefined ? newData.comment : current.comment,
    },
  };
};

export const computeOverallTotals = (
  questions: Question[],
  gradingData: GradingData
): { totalEstimated: number; totalAwarded: number } => {
  let totalEstimated = 0;
  let totalAwarded = 0;

  const traverse = (qs: Question[]) => {
    qs.forEach((q) => {
      if (q.subquestions?.length) {
        traverse(q.subquestions);
      } else {
        totalEstimated += q.weight;
        totalAwarded += gradingData[q.id]?.grade || 0;
      }
    });
  };

  traverse(questions);
  return { totalEstimated, totalAwarded };
};
