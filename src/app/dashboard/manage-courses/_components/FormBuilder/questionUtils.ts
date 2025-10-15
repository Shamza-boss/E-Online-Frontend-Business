import { HomeworkPayload, Question } from '../../../../_lib/interfaces/types';
import { v4 as uuidv4 } from 'uuid';

export const ALLOWED_TYPES: readonly Question['type'][] = [
  'video',
  'radio',
  'multi-select',
];

export const isChoiceType = (type: Question['type']) =>
  type === 'radio' || type === 'multi-select';

export interface QuestionMeta {
  question: Question;
  depth: number;
  parent: Question | null;
}

export type QuestionUpdateFn = (question: Question) => Question;

export const findQuestionMeta = (
  questions: Question[],
  targetId: string,
  depth = 0,
  parent: Question | null = null
): QuestionMeta | null => {
  for (const question of questions) {
    if (question.id === targetId) {
      return { question, depth, parent };
    }
    if (question.subquestions && question.subquestions.length > 0) {
      const result = findQuestionMeta(
        question.subquestions,
        targetId,
        depth + 1,
        question
      );
      if (result) return result;
    }
  }
  return null;
};

export const updateQuestionTree = (
  questions: Question[],
  targetId: string,
  updater: QuestionUpdateFn
): { updated: Question[]; changed: boolean } => {
  let changed = false;

  const updated = questions.map((question) => {
    if (question.id === targetId) {
      changed = true;
      return updater(question);
    }

    if (question.subquestions && question.subquestions.length > 0) {
      const childResult = updateQuestionTree(
        question.subquestions,
        targetId,
        updater
      );
      if (childResult.changed) {
        changed = true;
        return { ...question, subquestions: childResult.updated };
      }
    }

    return question;
  });

  return { updated, changed };
};

const normalizeOptions = (
  options: string[] | undefined,
  path: string,
  mustHaveOptions: boolean
): { sanitized: string[] | undefined; errors: string[] } => {
  if (!mustHaveOptions) {
    return { sanitized: undefined, errors: [] };
  }

  const trimmed = (options ?? [])
    .map((option) => (option ?? '').trim())
    .filter((option) => option.length > 0);

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const option of trimmed) {
    const key = option.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(option);
    }
  }

  const errors: string[] = [];
  if (unique.length < 2) {
    errors.push(
      `${path}: Choice questions require at least two unique options.`
    );
  }

  return { sanitized: unique, errors };
};

const normalizeChoiceNode = (
  question: Question,
  path: string,
  errors: string[],
  depth: number
): Question => {
  const sanitizedType = (question.type ?? '').trim() as Question['type'];
  const sanitizedText = (question.questionText ?? '').trim();
  const rawWeight = Number(question.weight);
  const sanitizedWeight = Number.isFinite(rawWeight) ? rawWeight : 0;

  const base: Question = {
    ...question,
    type: sanitizedType,
    questionText: sanitizedText,
    weight: sanitizedWeight,
    required: question.required ?? false,
    video: undefined,
  };

  if (!isChoiceType(base.type)) {
    errors.push(
      `${path}: Only single-select or multi-select types are allowed under a video section.`
    );
  }

  if (base.weight <= 0) {
    errors.push(`${path}: Weight must be greater than zero.`);
  }

  let sanitizedSubquestions = [...(question.subquestions ?? [])];
  if (depth >= 2 && sanitizedSubquestions.length > 0) {
    errors.push(
      `${path}: Nesting deeper than two levels under a video section is not allowed.`
    );
    sanitizedSubquestions = [];
  }

  if (sanitizedSubquestions.length > 0) {
    if (question.options && question.options.some((opt) => opt.trim().length)) {
      errors.push(
        `${path}: Questions that contain nested items cannot define options; options were cleared.`
      );
    }

    const processedChildren = sanitizedSubquestions.map((child, idx) =>
      normalizeChoiceNode(child, `${path}.${idx + 1}`, errors, depth + 1)
    );

    return {
      ...base,
      options: undefined,
      correctAnswer: undefined,
      correctAnswers: undefined,
      subquestions: processedChildren,
    };
  }

  const { sanitized, errors: optionErrors } = normalizeOptions(
    question.options,
    path,
    true
  );
  errors.push(...optionErrors);

  const availableOptions = sanitized ?? [];

  if (base.type === 'radio') {
    const candidate = (question.correctAnswer ?? '').trim();
    let normalizedAnswer: string | undefined = undefined;

    if (!candidate) {
      errors.push(`${path}: Select a correct answer for this question.`);
    } else {
      const match = availableOptions.find(
        (option) => option.toLowerCase() === candidate.toLowerCase()
      );
      if (!match) {
        errors.push(
          `${path}: Correct answer must exactly match one of the provided options.`
        );
      } else {
        normalizedAnswer = match;
      }
    }

    return {
      ...base,
      options: availableOptions,
      subquestions: [],
      correctAnswer: normalizedAnswer,
      correctAnswers: undefined,
    };
  }

  const rawAnswers = Array.isArray(question.correctAnswers)
    ? question.correctAnswers
    : typeof question.correctAnswer === 'string' && question.correctAnswer
      ? [question.correctAnswer]
      : [];

  const trimmedAnswers = rawAnswers
    .map((answer) => (answer ?? '').trim())
    .filter((answer) => answer.length > 0);

  const uniqueAnswers: string[] = [];
  const seen = new Set<string>();

  for (const answer of trimmedAnswers) {
    const match = availableOptions.find(
      (option) => option.toLowerCase() === answer.toLowerCase()
    );

    if (!match) {
      errors.push(
        `${path}: Each correct answer must match one of the provided options.`
      );
      continue;
    }

    const key = match.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueAnswers.push(match);
    }
  }

  if (uniqueAnswers.length === 0) {
    errors.push(
      `${path}: Select at least one correct answer for this multi-select question.`
    );
  }

  return {
    ...base,
    options: availableOptions,
    subquestions: [],
    correctAnswer: undefined,
    correctAnswers: uniqueAnswers,
  };
};

const normalizeRootQuestion = (
  question: Question,
  path: string,
  errors: string[]
): Question => {
  const sanitizedType = (question.type ?? '').trim() as Question['type'];
  if (!sanitizedType) {
    errors.push(`${path}: Question type is required.`);
  }

  if (!ALLOWED_TYPES.includes(sanitizedType)) {
    errors.push(`${path}: Unsupported question type '${question.type}'.`);
  }

  const sanitizedText = (question.questionText ?? '').trim();

  if (sanitizedType === 'video') {
    const subquestions = question.subquestions ?? [];
    if (subquestions.length === 0) {
      errors.push(
        `${path}: A video section must contain at least one subquestion.`
      );
    }

    const processedSubquestions = subquestions.map((sub, idx) =>
      normalizeChoiceNode(sub, `${path}.${idx + 1}`, errors, 1)
    );

    return {
      ...question,
      type: 'video',
      questionText: sanitizedText,
      required: false,
      options: undefined,
      weight: 0,
      subquestions: processedSubquestions,
    };
  }

  if (isChoiceType(sanitizedType)) {
    if (question.subquestions && question.subquestions.length > 0) {
      errors.push(
        `${path}: Standalone choice questions cannot contain subquestions.`
      );
    }

    return normalizeChoiceNode(
      {
        ...question,
        type: sanitizedType,
        questionText: sanitizedText,
        video: undefined,
      },
      path,
      errors,
      0
    );
  }

  return {
    ...question,
    questionText: sanitizedText,
    subquestions: question.subquestions ?? [],
  };
};

export const buildValidatedHomework = (
  title: string,
  description: string,
  dueDate: string,
  hasExpiry: boolean,
  expiryDate: string,
  questions: Question[]
): { homework: HomeworkPayload; errors: string[] } => {
  const errors: string[] = [];

  const sanitizedTitle = title.trim();
  const sanitizedDescription = (description ?? '').trim();
  const sanitizedDueDate = (dueDate ?? '').trim();
  const sanitizedExpiryDate = (expiryDate ?? '').trim();

  if (!sanitizedTitle) {
    errors.push('Title is required.');
  }

  if (!sanitizedDueDate) {
    errors.push('Due date is required.');
  }

  const due = sanitizedDueDate ? new Date(sanitizedDueDate) : null;

  if (due && Number.isNaN(due.getTime())) {
    errors.push('Due date is invalid.');
  }

  let normalizedExpiry: string | null = null;
  if (hasExpiry) {
    if (!sanitizedExpiryDate) {
      errors.push('Expiry date is required when expiry is enabled.');
    }

    const expiry = sanitizedExpiryDate ? new Date(sanitizedExpiryDate) : null;
    if (expiry && Number.isNaN(expiry.getTime())) {
      errors.push('Expiry date is invalid.');
    }

    if (expiry && due && expiry.getTime() <= due.getTime()) {
      errors.push('Expiry date must be after the due date.');
    }

    if (expiry && !Number.isNaN(expiry.getTime())) {
      normalizedExpiry = sanitizedExpiryDate;
    }
  }

  if (questions.length === 0) {
    errors.push('At least one question is required before saving.');
  }

  const sanitizedQuestions = questions.map((question, idx) =>
    normalizeRootQuestion(question, `Question ${idx + 1}`, errors)
  );

  const homework: HomeworkPayload = {
    title: sanitizedTitle,
    description: sanitizedDescription,
    dueDate: sanitizedDueDate,
    hasExpiry,
    expiryDate: hasExpiry ? normalizedExpiry : null,
    questions: sanitizedQuestions,
  };

  return { homework, errors };
};

export const createLeafQuestion = (): Question => ({
  id: uuidv4(),
  questionText: '',
  type: 'radio',
  options: ['', ''],
  required: false,
  weight: 1,
  subquestions: [],
  correctAnswer: '',
  correctAnswers: [],
});

export const createVideoQuestion = (): Question => ({
  id: uuidv4(),
  questionText: '',
  type: 'video',
  options: [],
  required: false,
  weight: 0,
  subquestions: [],
  correctAnswer: undefined,
  correctAnswers: undefined,
});
