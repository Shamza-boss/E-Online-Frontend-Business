import {
  Question,
  HomeworkAssignmentDto,
  AssignmentDetailsDto,
} from '../interfaces/types';
import { getAssignmentById } from '../actions/homework';

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
 * Calculates the percentage score for a homework assignment
 * @param assignment The homework assignment to calculate percentage for
 * @returns Promise resolving to the percentage score (0-100)
 */
export const calculatePercentageFromAssignment = async (
  assignment: HomeworkAssignmentDto
): Promise<number> => {
  if (!assignment.isGraded) return 0;

  try {
    // Fetch the full assignment details to get homework structure and grading
    const assignmentDetails = await getAssignmentById(assignment.assignmentId);

    // Calculate overall totals
    const overallTotals = calculateHomeworkTotals(
      assignmentDetails.homework.questions,
      assignmentDetails.grading || {}
    );

    // Calculate percentage
    return overallTotals.estimated > 0
      ? (overallTotals.awarded / overallTotals.estimated) * 100
      : 0;
  } catch (error) {
    console.error('Error calculating percentage:', error);
    return 0;
  }
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

/**
 * Calculates the total weight and awarded score for displaying in "Grade/Total Weight" format
 * @param assignment The homework assignment to calculate totals for
 * @returns Promise resolving to an object with awarded and total weight
 */
export const calculateGradeDisplay = async (
  assignment: HomeworkAssignmentDto
): Promise<{ awarded: number; totalWeight: number } | null> => {
  if (!assignment.isGraded) return null;

  try {
    // Fetch the full assignment details to get homework structure and grading
    const assignmentDetails = await getAssignmentById(assignment.assignmentId);

    // Calculate overall totals
    const totals = calculateHomeworkTotals(
      assignmentDetails.homework.questions,
      assignmentDetails.grading || {}
    );

    return {
      awarded: totals.awarded,
      totalWeight: totals.estimated,
    };
  } catch (error) {
    console.error('Error calculating grade display:', error);
    return null;
  }
};
