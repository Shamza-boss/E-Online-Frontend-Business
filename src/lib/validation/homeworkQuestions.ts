import { HomeworkPayload, Question } from '@/app/_lib/interfaces/types';

export const validateHomeworkPayload = (payload: HomeworkPayload): string | null => {
  if (!payload.title?.trim()) {
    return 'Title is required';
  }
  if (!payload.dueDate) {
    return 'Due date is required';
  }
  if (!payload.questions || payload.questions.length === 0) {
    return 'At least one question is required';
  }

  for (let i = 0; i < payload.questions.length; i++) {
    const error = validateQuestion(payload.questions[i], `Question ${i + 1}`);
    if (error) return error;
  }

  return null;
};

const validateQuestion = (question: Question, path: string): string | null => {
  const type = question.type;

  if (!['video', 'pdf', 'single-select', 'multi-select', 'group'].includes(type)) {
    return `${path}: Invalid question type '${type}'`;
  }

  // Group validation
  if (type === 'group') {
    if (question.subquestions && question.subquestions.length > 0) {
      for (let i = 0; i < question.subquestions.length; i++) {
        const sub = question.subquestions[i];
        const subPath = `${path}.${i + 1}`;
        const subError = validateQuestion(sub, subPath);
        if (subError) return subError;
      }
    }
    return null;
  }

  // Container validation
  if (type === 'video' || type === 'pdf') {
    if (!question.subquestions || question.subquestions.length === 0) {
      return `${path}: ${type === 'video' ? 'Video' : 'PDF'} sections must contain at least one question`;
    }
    if (question.subquestions && question.subquestions.length > 0) {
      for (let i = 0; i < question.subquestions.length; i++) {
        const sub = question.subquestions[i];
        const subPath = `${path}.${i + 1}`;

        if (sub.type === 'video' || sub.type === 'pdf') {
          return `${subPath}: Nested containers are not allowed`;
        }

        const subError = validateQuestion(sub, subPath);
        if (subError) return subError;
      }
    }
  } else {
    // Atomic validation
    if (question.subquestions && question.subquestions.length > 0) {
      return `${path}: Atomic questions cannot have subquestions`;
    }

    if (!question.options || question.options.length < 2) {
      return `${path}: Must have at least 2 options`;
    }

    if (type === 'single-select') {
      if (!question.correctAnswer) {
        return `${path}: Must have a correct answer`;
      }
      // Backend expects case-insensitive match, but frontend usually enforces exact match in UI.
      // We'll check if the answer exists in options (case-insensitive to be safe or exact?)
      // The backend uses StringComparison.OrdinalIgnoreCase.
      const hasMatch = question.options.some(
        (opt) => opt.trim().toLowerCase() === question.correctAnswer!.trim().toLowerCase()
      );
      if (!hasMatch) {
        return `${path}: Correct answer must be one of the options`;
      }
    } else if (type === 'multi-select') {
      // Frontend uses correctAnswers array
      if (!question.correctAnswers || question.correctAnswers.length === 0) {
        return `${path}: Must have at least one correct answer`;
      }
      
      for (const ans of question.correctAnswers) {
        const hasMatch = question.options.some(
            (opt) => opt.trim().toLowerCase() === ans.trim().toLowerCase()
        );
        if (!hasMatch) {
          return `${path}: Correct answer '${ans}' is not in options`;
        }
      }
    }
  }

  return null;
};
