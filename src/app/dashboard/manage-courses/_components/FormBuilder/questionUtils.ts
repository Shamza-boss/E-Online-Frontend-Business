import { Homework, Question } from '../../../../_lib/interfaces/types';
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

  if (base.weight < 0) {
    errors.push(`${path}: Weight cannot be negative.`);
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
      subquestions: processedChildren,
    };
  }

  const { sanitized, errors: optionErrors } = normalizeOptions(
    question.options,
    path,
    true
  );
  errors.push(...optionErrors);

  return {
    ...base,
    options: sanitized,
    subquestions: [],
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

    const { sanitized, errors: optionErrors } = normalizeOptions(
      question.options,
      path,
      true
    );
    errors.push(...optionErrors);

    const rawWeight = Number(question.weight);
    const sanitizedWeight = Number.isFinite(rawWeight) ? rawWeight : 0;
    if (sanitizedWeight < 0) {
      errors.push(`${path}: Weight cannot be negative.`);
    }

    return {
      ...question,
      type: sanitizedType,
      questionText: sanitizedText,
      weight: sanitizedWeight,
      video: undefined,
      subquestions: [],
      options: sanitized,
    };
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
  publishDate: string,
  dueDate: string,
  questions: Question[]
): { homework: Homework; errors: string[] } => {
  const errors: string[] = [];

  const sanitizedTitle = title.trim();
  const sanitizedDescription = (description ?? '').trim();

  if (!sanitizedTitle) {
    errors.push('Title is required.');
  }

  if (!publishDate) {
    errors.push('Publish date is required.');
  }

  if (!dueDate) {
    errors.push('Due date is required.');
  }

  const publish = publishDate ? new Date(publishDate) : null;
  const due = dueDate ? new Date(dueDate) : null;

  if (publish && Number.isNaN(publish.getTime())) {
    errors.push('Publish date is invalid.');
  }

  if (due && Number.isNaN(due.getTime())) {
    errors.push('Due date is invalid.');
  }

  if (publish && due && publish.getTime() > due.getTime()) {
    errors.push('Due date cannot be before publish date.');
  }

  if (questions.length === 0) {
    errors.push('At least one question is required before publishing.');
  }

  const sanitizedQuestions = questions.map((question, idx) =>
    normalizeRootQuestion(question, `Question ${idx + 1}`, errors)
  );

  const homework: Homework = {
    title: sanitizedTitle,
    description: sanitizedDescription,
    publishDate,
    dueDate,
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
  weight: 0,
  subquestions: [],
});

export const createVideoQuestion = (): Question => ({
  id: uuidv4(),
  questionText: '',
  type: 'video',
  options: [],
  required: false,
  weight: 0,
  subquestions: [],
});
