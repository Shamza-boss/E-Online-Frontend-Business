import { HomeworkPayload, Question } from '../../../../_lib/interfaces/types';
import { v4 as uuidv4 } from 'uuid';

export const SUBQUESTION_DND_MIME = 'application/x-eonline-subquestion-move';
export const NEW_QUESTION_DND_MIME = 'application/x-eonline-new-question';

export const ALLOWED_TYPES: readonly Question['type'][] = [
  'video',
  'pdf',
  'single-select',
  'multi-select',
  'group',
];

/**
 * Enforces the nesting matrix rules:
 * - Group containers can contain Video, PDF, Single-select, Multi-select.
 * - Video/PDF containers can ONLY contain single-select or multi-select questions.
 * - Containers cannot contain other containers (Video inside Video is forbidden).
 * - Atomic questions (single/multi) cannot contain children.
 */
export const IsValidChild = (parentType: string, childType: string): boolean => {
  if (parentType === 'group') {
    return ['video', 'pdf', 'single-select', 'multi-select'].includes(childType);
  }
  if (parentType === 'video' || parentType === 'pdf') {
    return childType === 'single-select' || childType === 'multi-select';
  }
  return false;
};

export const isChoiceType = (type: Question['type']) =>
  type === 'single-select' || type === 'multi-select';

export interface QuestionMeta {
  question: Question;
  depth: number;
  parent: Question | null;
}

export type QuestionUpdateFn = (question: Question) => Question;

export const flattenHomeworkQuestions = (questions: Question[]): Question[] => {
  const flat: Question[] = [];
  for (const q of questions) {
    flat.push(q);
    if (q.subquestions && q.subquestions.length > 0) {
      flat.push(...flattenHomeworkQuestions(q.subquestions));
    }
  }
  return flat;
};

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
  errors: string[]
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
    pdf: undefined,
  };

  if (!isChoiceType(base.type)) {
    errors.push(
      `${path}: Only single-select or multi-select types are allowed under a media section.`
    );
  }

  if (base.weight <= 0) {
    errors.push(`${path}: Weight must be greater than zero.`);
  }

  if (question.subquestions && question.subquestions.length > 0) {
    errors.push(
      `${path}: Atomic questions cannot contain subquestions; nested items were removed.`
    );
  }

  const { sanitized, errors: optionErrors } = normalizeOptions(
    question.options,
    path,
    true
  );
  errors.push(...optionErrors);

  const availableOptions = sanitized ?? [];

  if (base.type === 'single-select') {
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

  if (base.type === 'multi-select') {
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
  }

  return {
    ...base,
    options: availableOptions,
    subquestions: [],
    correctAnswer: undefined,
    correctAnswers: undefined,
  };
};

const normalizeSectionQuestion = (
  question: Question,
  path: string,
  errors: string[],
  sectionType: 'video' | 'pdf'
): Question => {
  const label = sectionType === 'video' ? 'video' : 'PDF';
  const sanitizedText = (question.questionText ?? '').trim();
  const subquestions = question.subquestions ?? [];

  const processedSubquestions = subquestions
    .map((sub, idx) => {
      const childType = (sub.type ?? '').trim() as Question['type'];
      if (!isChoiceType(childType)) {
        errors.push(
          `${path}.${idx + 1}: Only single-select or multi-select questions are allowed inside a ${label.toLowerCase()} section.`
        );
        return null;
      }

      return normalizeChoiceNode(
        { ...sub, type: childType },
        `${path}.${idx + 1}`,
        errors
      );
    })
    .filter(Boolean) as Question[];

  if (processedSubquestions.length === 0) {
    errors.push(
      `${path}: A ${label.toLowerCase()} section must contain at least one subquestion.`
    );
  }

  if (sectionType === 'pdf') {
    const pdfMeta = question.pdf;
    const provider = (pdfMeta?.provider ?? 'r2').trim() || 'r2';
    const key = (pdfMeta?.key ?? '').trim();
    const url = (pdfMeta?.url ?? '').trim();
    const hash = pdfMeta?.hash?.trim() ?? null;
    const sizeBytes =
      typeof pdfMeta?.sizeBytes === 'number'
        ? pdfMeta.sizeBytes
        : (pdfMeta?.sizeBytes ?? null);
    const title = pdfMeta?.title?.trim() ?? null;

    if (!key) {
      errors.push(`${path}: Attach a PDF file before saving this section.`);
    }

    return {
      ...question,
      type: 'pdf',
      questionText: sanitizedText,
      required: false,
      options: undefined,
      weight: 0,
      video: undefined,
      pdf: key
        ? {
            provider,
            key,
            url,
            hash,
            sizeBytes,
            title,
          }
        : undefined,
      subquestions: processedSubquestions,
    };
  }

  return {
    ...question,
    type: 'video',
    questionText: sanitizedText,
    required: false,
    options: undefined,
    weight: 0,
    pdf: undefined,
    subquestions: processedSubquestions,
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

  if (sanitizedType === 'video' || sanitizedType === 'pdf') {
    return normalizeSectionQuestion(question, path, errors, sanitizedType);
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
        questionText: (question.questionText ?? '').trim(),
        video: undefined,
        pdf: undefined,
        subquestions: [],
      },
      path,
      errors
    );
  }

  return {
    ...question,
    questionText: (question.questionText ?? '').trim(),
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
  type: 'single-select',
  options: ['', ''],
  required: false,
  weight: 1,
  subquestions: [],
  video: undefined,
  pdf: undefined,
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
  video: undefined,
  pdf: undefined,
  correctAnswer: undefined,
  correctAnswers: undefined,
});

export const createPdfQuestion = (): Question => ({
  id: uuidv4(),
  questionText: '',
  type: 'pdf',
  options: [],
  required: false,
  weight: 0,
  subquestions: [],
  video: undefined,
  pdf: undefined,
  correctAnswer: undefined,
  correctAnswers: undefined,
});

export const createGroupQuestion = (): Question => ({
  id: uuidv4(),
  questionText: '',
  type: 'group',
  options: [],
  required: false,
  weight: 0,
  subquestions: [],
  video: undefined,
  pdf: undefined,
  correctAnswer: undefined,
  correctAnswers: undefined,
});

export const createPlaceholderQuestion = (): Question => ({
  id: uuidv4(),
  questionText: '',
  type: 'placeholder',
  options: [],
  required: false,
  weight: 0,
  subquestions: [],
  video: undefined,
  pdf: undefined,
  correctAnswer: undefined,
  correctAnswers: undefined,
});
