import { Question } from '../interfaces/types';

/**
 * Utility functions for calculating homework grades and percentages
 */

/**
 * Recursively computes the total awarded and estimated points for a question
 * @param question The question to compute totals for
 * @param grading The grading data containing scores for each question
 * @returns Object containing awarded and estimated points
 */
export const computeQuestionTotals = (
  question: Question,
  grading: { [questionId: string]: { grade: number; comment: string } }
): { awarded: number; estimated: number } => {
  if (question.subquestions && question.subquestions.length > 0) {
    return question.subquestions.reduce(
      (acc, sub) => {
        const totals = computeQuestionTotals(sub, grading);
        return {
          awarded: acc.awarded + totals.awarded,
          estimated: acc.estimated + totals.estimated,
        };
      },
      { awarded: 0, estimated: 0 }
    );
  } else {
    return {
      awarded: grading[question.id]?.grade || 0,
      estimated: question.weight,
    };
  }
};

/**
 * Calculates the overall totals for a homework assignment
 * @param questions Array of questions in the homework
 * @param grading The grading data containing scores for each question
 * @returns Object containing total awarded and estimated points
 */
export const calculateHomeworkTotals = (
  questions: Question[],
  grading: { [questionId: string]: { grade: number; comment: string } }
): { awarded: number; estimated: number } => {
  return questions.reduce(
    (acc, question) => {
      const totals = computeQuestionTotals(question, grading);
      return {
        awarded: acc.awarded + totals.awarded,
        estimated: acc.estimated + totals.estimated,
      };
    },
    { awarded: 0, estimated: 0 }
  );
};

/**
 * Gets the appropriate color for displaying a percentage score
 * @param percentage The percentage score (0-100)
 * @returns MUI color name for the chip
 */
export const getPercentageColor = (
  percentage: number
): 'success' | 'primary' | 'warning' | 'error' => {
  if (percentage >= 90) return 'success';
  if (percentage >= 80) return 'primary';
  if (percentage >= 70) return 'warning';
  return 'error';
};
