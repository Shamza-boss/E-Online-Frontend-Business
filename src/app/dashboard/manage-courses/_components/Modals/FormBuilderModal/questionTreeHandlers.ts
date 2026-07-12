import type React from 'react';
import type { Question } from '@/app/_lib/interfaces/types';
import {
  createLeafQuestion,
  createVideoQuestion,
  createPdfQuestion,
  findQuestionMeta,
  isChoiceType,
  updateQuestionTree,
  IsValidChild,
  convertQuestionToContainer,
} from '../../FormBuilder/questionUtils';

type SetQuestions = React.Dispatch<React.SetStateAction<Question[]>>;
type SetCurrentIndex = React.Dispatch<React.SetStateAction<number>>;

export function createQuestionTreeHandlers(
  questions: Question[],
  setQuestions: SetQuestions,
  setCurrentQuestionIndex: SetCurrentIndex,
  onConvertRequired: (parentId: string, type: Question['type']) => void,
) {
  const handleQuestionFieldChange = (
    questionId: string,
    key: keyof Question,
    value: unknown,
  ) => {
    setQuestions((prev) => {
      const { updated, changed } = updateQuestionTree(prev, questionId, (q) => ({
        ...q,
        [key]: value,
      }));
      return changed ? updated : prev;
    });
  };

  const handleQuestionTypeChange = (questionId: string, newType: Question['type']) => {
    setQuestions((prev) => {
      const meta = findQuestionMeta(prev, questionId);
      if (!meta) return prev;
      if (
        meta.depth > 0 &&
        (newType === 'video' || newType === 'pdf') &&
        meta.parent?.type !== 'group'
      ) {
        return prev;
      }

      const { updated, changed } = updateQuestionTree(prev, questionId, (q) => {
        if (newType === 'video') {
          return {
            ...q,
            type: 'video',
            required: false,
            weight: 0,
            options: undefined,
            subquestions: q.subquestions ?? [],
            video: q.video,
            pdf: undefined,
            correctAnswer: undefined,
            correctAnswers: undefined,
          };
        }
        if (newType === 'pdf') {
          return {
            ...q,
            type: 'pdf',
            required: false,
            weight: 0,
            options: undefined,
            subquestions: q.subquestions ?? [],
            video: undefined,
            pdf: q.pdf,
            correctAnswer: undefined,
            correctAnswers: undefined,
          };
        }

        const hasChildren = (q.subquestions ?? []).length > 0;
        const fallbackOptions = q.options && q.options.length > 0 ? [...q.options] : ['', ''];
        const baseUpdate = {
          type: newType,
          video: undefined,
          pdf: undefined,
          options: hasChildren ? undefined : fallbackOptions,
          correctAnswer: newType === 'single-select' ? '' : undefined,
          correctAnswers: newType === 'multi-select' ? [] : undefined,
          weight: Math.max(q.weight || 1, 1),
        };

        if (meta.depth === 0) {
          return { ...q, ...baseUpdate, subquestions: [] };
        }
        return { ...q, ...baseUpdate };
      });

      return changed ? updated : prev;
    });
  };

  const handleQuestionWeightChange = (questionId: string, value: string) => {
    const numeric = Number(value);
    handleQuestionFieldChange(
      questionId,
      'weight',
      Number.isFinite(numeric) && numeric > 0 ? numeric : 1,
    );
  };

  const addOption = (questionId: string) => {
    setQuestions((prev) => {
      const { updated, changed } = updateQuestionTree(prev, questionId, (q) => {
        if (q.subquestions && q.subquestions.length > 0) return q;
        return { ...q, options: [...(q.options ?? []), ''] };
      });
      return changed ? updated : prev;
    });
  };

  const handleOptionChange = (questionId: string, index: number, value: string) => {
    setQuestions((prev) => {
      const { updated, changed } = updateQuestionTree(prev, questionId, (q) => {
        const options = [...(q.options ?? [])];
        const previous = options[index];
        options[index] = value;
        let correctAnswer = q.correctAnswer;
        let correctAnswers = q.correctAnswers;

        if (q.type === 'single-select' && previous === q.correctAnswer) {
          correctAnswer = value;
        }
        if (q.type === 'multi-select' && Array.isArray(correctAnswers)) {
          correctAnswers = correctAnswers.map((answer) =>
            answer === previous ? value : answer,
          );
        }
        return { ...q, options, correctAnswer, correctAnswers };
      });
      return changed ? updated : prev;
    });
  };

  const createSubquestion = (type: Question['type']): Question | null => {
    if (type === 'single-select' || type === 'multi-select') {
      return { ...createLeafQuestion(), type };
    }
    if (type === 'video') return createVideoQuestion();
    if (type === 'pdf') return createPdfQuestion();
    return null;
  };

  const addSubquestionInternal = (parentId: string, type: Question['type'] = 'single-select') => {
    setQuestions((prev) => {
      const meta = findQuestionMeta(prev, parentId);
      if (!meta || !IsValidChild(meta.question.type, type)) return prev;

      const newSub = createSubquestion(type);
      if (!newSub) return prev;

      const { updated, changed } = updateQuestionTree(prev, parentId, (q) => {
        const updatedSubquestions = [...(q.subquestions ?? []), newSub];
        const base: Question = { ...q, subquestions: updatedSubquestions };
        return meta.depth === 1 ? { ...base, options: undefined } : base;
      });

      return changed ? updated : prev;
    });
  };

  const addSubquestion = (parentId: string, type: Question['type'] = 'single-select') => {
    const meta = findQuestionMeta(questions, parentId);
    if (!meta) return;

    if (
      isChoiceType(meta.question.type) &&
      (!meta.question.subquestions || meta.question.subquestions.length === 0)
    ) {
      onConvertRequired(parentId, type);
      return;
    }

    addSubquestionInternal(parentId, type);
  };

  const removeSubquestion = (parentId: string, subId: string) => {
    setQuestions((prev) => {
      const meta = findQuestionMeta(prev, parentId);
      if (!meta) return prev;

      const { updated, changed } = updateQuestionTree(prev, parentId, (parent) => {
        const filtered = (parent.subquestions ?? []).filter((sub) => sub.id !== subId);
        const base: Question = { ...parent, subquestions: filtered };

        if (meta.depth > 0 && filtered.length === 0 && isChoiceType(parent.type)) {
          return {
            ...base,
            options: parent.options && parent.options.length > 0 ? [...parent.options] : ['', ''],
            correctAnswer:
              parent.type === 'single-select' ? (parent.correctAnswer ?? '') : undefined,
            correctAnswers:
              parent.type === 'multi-select' ? (parent.correctAnswers ?? []) : undefined,
          };
        }
        return base;
      });

      return changed ? updated : prev;
    });
  };

  const removeQuestion = (questionId: string) => {
    setQuestions((prev) => {
      const updated = prev.filter((q) => q.id !== questionId);
      setCurrentQuestionIndex((idx) =>
        updated.length === 0 ? 0 : Math.min(idx, updated.length - 1),
      );
      return updated;
    });
  };

  const addQuestion = () => {
    const newQuestion = createLeafQuestion();
    setQuestions((prev) => {
      const updated = [...prev, newQuestion];
      setCurrentQuestionIndex(updated.length - 1);
      return updated;
    });
  };

  const handleConfirmConvert = (parentId: string, type: Question['type']) => {
    setQuestions((prev) => {
      const { updated: convertedQuestions, changed: converted } = updateQuestionTree(
        prev,
        parentId,
        (q) => convertQuestionToContainer(q),
      );
      if (!converted) return prev;

      const newSub = createSubquestion(type);
      if (!newSub) return convertedQuestions;

      const { updated: finalQuestions } = updateQuestionTree(
        convertedQuestions,
        parentId,
        (q) => ({
          ...q,
          subquestions: [...(q.subquestions ?? []), newSub],
        }),
      );

      return finalQuestions;
    });
  };

  const onInsertSubquestionFromPalette = (
    parentId: string,
    insertIndex: number,
    type: Question['type'],
  ) => {
    setQuestions((prev) => {
      const meta = findQuestionMeta(prev, parentId);
      if (!meta || !IsValidChild(meta.question.type, type)) return prev;

      const newSub = createSubquestion(type);
      if (!newSub) return prev;

      const { updated, changed } = updateQuestionTree(prev, parentId, (q) => {
        const existing = q.subquestions ?? [];
        const updatedSubquestions = [...existing];
        updatedSubquestions.splice(insertIndex, 0, newSub);
        const base: Question = { ...q, subquestions: updatedSubquestions };
        return meta.depth === 1 ? { ...base, options: undefined } : base;
      });

      return changed ? updated : prev;
    });
  };

  const onReorderSubquestions = (parentId: string, fromIdx: number, toIdx: number) => {
    setQuestions((prev) => {
      const { updated, changed } = updateQuestionTree(prev, parentId, (q) => {
        const subs = [...(q.subquestions ?? [])];
        const [moved] = subs.splice(fromIdx, 1);
        if (!moved) return q;
        subs.splice(toIdx, 0, moved);
        return { ...q, subquestions: subs };
      });
      return changed ? updated : prev;
    });
  };

  const handleContainerDrop = (event: React.DragEvent, mimeType: string) => {
    const type = event.dataTransfer.getData(mimeType) as Question['type'];
    if (!type) return;

    event.preventDefault();
    event.stopPropagation();

    const newQuestion = createSubquestion(type);
    if (!newQuestion) return;

    setQuestions((prev) => {
      const updated = [...prev, newQuestion];
      setCurrentQuestionIndex(updated.length - 1);
      return updated;
    });
  };

  return {
    handleQuestionFieldChange,
    handleQuestionTypeChange,
    handleQuestionWeightChange,
    addOption,
    handleOptionChange,
    addSubquestion,
    removeSubquestion,
    removeQuestion,
    addQuestion,
    handleConfirmConvert,
    onInsertSubquestionFromPalette,
    onReorderSubquestions,
    handleContainerDrop,
  };
}
