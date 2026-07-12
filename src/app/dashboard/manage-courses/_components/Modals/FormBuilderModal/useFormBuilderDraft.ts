'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Homework, HomeworkPayload, Question } from '@/app/_lib/interfaces/types';
import {
  getHomeworkDraft,
  setHomeworkDraft,
  removeHomeworkDraft,
  migrateLocalStorageDrafts,
} from '@/app/_lib/utils/homeworkDraftStore';
import {
  FORM_STORAGE_KEY,
  LEGACY_FORM_STORAGE_KEY,
  HOMEWORK_DRAFT_IDLE_MS,
} from './constants';
import { getTomorrowDate } from './utils';

type DraftPayload = {
  homework: HomeworkPayload;
  currentQuestionIndex: number;
};

type UseFormBuilderDraftArgs = {
  open: boolean;
  initialHomework?: Homework | null;
};

export function useFormBuilderDraft({
  open,
  initialHomework = null,
}: UseFormBuilderDraftArgs) {
  const [formTitle, setFormTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTomorrowDate());
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [isExam, setIsExam] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [allowReset, setAllowReset] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [activeHomeworkId, setActiveHomeworkId] = useState<string | null>(null);
  const [prefillSource, setPrefillSource] = useState<string | null>(null);

  const draftSaveTimeoutRef = useRef<number | null>(null);
  const latestDraftPayloadRef = useRef<DraftPayload | null>(null);
  const lastDraftSnapshotRef = useRef<string | null>(null);

  const clearDraftStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    void removeHomeworkDraft(FORM_STORAGE_KEY);
    localStorage.removeItem(LEGACY_FORM_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;

    const applyDraft = (
      homework: HomeworkPayload | null,
      questionIndex: number,
    ) => {
      if (cancelled) return;
      const storedQuestions: Question[] = Array.isArray(homework?.questions)
        ? homework.questions
        : [];

      setFormTitle(homework?.title ?? '');
      setDescription(homework?.description ?? '');
      setDueDate(homework?.dueDate ?? '');
      setHasExpiry(Boolean(homework?.hasExpiry));
      setExpiryDate(homework?.expiryDate ?? '');
      setQuestions(storedQuestions);
      if (storedQuestions.length > 0) {
        setCurrentQuestionIndex(
          Math.min(questionIndex, storedQuestions.length - 1),
        );
      }
    };

    void (async () => {
      try {
        await migrateLocalStorageDrafts([
          FORM_STORAGE_KEY,
          LEGACY_FORM_STORAGE_KEY,
        ]);
        const record = await getHomeworkDraft(FORM_STORAGE_KEY);
        if (record) {
          applyDraft(
            record.homework as HomeworkPayload | null,
            record.currentQuestionIndex,
          );
          return;
        }

        const legacy = await getHomeworkDraft(LEGACY_FORM_STORAGE_KEY);
        if (legacy) {
          const parsed = legacy.homework as Record<string, unknown>;
          applyDraft(
            {
              title:
                (parsed?.formTitle as string) ??
                (parsed?.title as string) ??
                '',
              description: (parsed?.description as string) ?? '',
              dueDate: (parsed?.dueDate as string) ?? '',
              hasExpiry: Boolean(parsed?.hasExpiry),
              expiryDate: (parsed?.expiryDate as string) ?? '',
              questions: Array.isArray(parsed?.questions)
                ? (parsed.questions as Question[])
                : [],
            },
            legacy.currentQuestionIndex,
          );
        }
      } catch (error) {
        console.error('Failed to restore form builder draft', error);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    if (draftSaveTimeoutRef.current) {
      window.clearTimeout(draftSaveTimeoutRef.current);
      draftSaveTimeoutRef.current = null;
    }

    const isEmpty =
      formTitle.trim() === '' &&
      description.trim() === '' &&
      dueDate.trim() === '' &&
      !hasExpiry &&
      expiryDate.trim() === '' &&
      questions.length === 0;
    if (isEmpty) {
      lastDraftSnapshotRef.current = null;
      clearDraftStorage();
      return;
    }

    const payload: DraftPayload = {
      homework: {
        title: formTitle,
        description,
        dueDate,
        hasExpiry,
        expiryDate: hasExpiry ? expiryDate : null,
        isExam,
        scheduledAt: isExam ? scheduledAt || null : null,
        allowReset,
        questions,
      },
      currentQuestionIndex,
    };
    latestDraftPayloadRef.current = payload;

    const snapshot = JSON.stringify(payload);
    if (snapshot === lastDraftSnapshotRef.current) return;
    lastDraftSnapshotRef.current = snapshot;

    draftSaveTimeoutRef.current = window.setTimeout(() => {
      void setHomeworkDraft({
        key: FORM_STORAGE_KEY,
        homework: payload.homework,
        currentQuestionIndex: payload.currentQuestionIndex,
        updatedAt: Date.now(),
      });
    }, HOMEWORK_DRAFT_IDLE_MS);

    return () => {
      if (draftSaveTimeoutRef.current) {
        window.clearTimeout(draftSaveTimeoutRef.current);
        draftSaveTimeoutRef.current = null;
      }
    };
  }, [
    hydrated,
    formTitle,
    description,
    dueDate,
    hasExpiry,
    expiryDate,
    isExam,
    scheduledAt,
    allowReset,
    questions,
    currentQuestionIndex,
    clearDraftStorage,
  ]);

  useEffect(() => {
    return () => {
      if (typeof window === 'undefined' || !draftSaveTimeoutRef.current) return;
      window.clearTimeout(draftSaveTimeoutRef.current);
      draftSaveTimeoutRef.current = null;

      const latestPayload = latestDraftPayloadRef.current;
      if (!latestPayload) return;

      void setHomeworkDraft({
        key: FORM_STORAGE_KEY,
        homework: latestPayload.homework,
        currentQuestionIndex: latestPayload.currentQuestionIndex,
        updatedAt: Date.now(),
      });
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    if (initialHomework) {
      const resolvedId =
        initialHomework.id ?? initialHomework.homeworkId ?? null;
      const sourceKey = resolvedId ?? 'unknown';
      if (prefillSource !== sourceKey) {
        setActiveHomeworkId(resolvedId);
        setFormTitle(initialHomework.title ?? '');
        setDescription(initialHomework.description ?? '');
        setDueDate(initialHomework.dueDate ?? '');
        const enableExpiry = Boolean(initialHomework.hasExpiry);
        setHasExpiry(enableExpiry);
        setExpiryDate(
          enableExpiry && initialHomework.expiryDate
            ? initialHomework.expiryDate
            : '',
        );
        setIsExam(Boolean(initialHomework.isExam));
        setScheduledAt(initialHomework.scheduledAt ?? '');
        setAllowReset(Boolean(initialHomework.allowReset));
        setQuestions(
          initialHomework.questions
            ? JSON.parse(JSON.stringify(initialHomework.questions))
            : [],
        );
        setCurrentQuestionIndex(0);
        setPrefillSource(sourceKey);
      }
    } else if (prefillSource !== 'create') {
      setActiveHomeworkId(null);
      setPrefillSource('create');
    }
  }, [open, initialHomework, prefillSource]);

  useEffect(() => {
    if (!open) setPrefillSource(null);
  }, [open]);

  useEffect(() => {
    setCurrentQuestionIndex((idx) => {
      if (questions.length === 0) return 0;
      return Math.min(idx, questions.length - 1);
    });
  }, [questions.length]);

  const resetForm = useCallback(() => {
    setFormTitle('');
    setDescription('');
    setDueDate(getTomorrowDate());
    setHasExpiry(false);
    setExpiryDate('');
    setIsExam(false);
    setScheduledAt('');
    setAllowReset(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setActiveHomeworkId(null);
    setPrefillSource(null);
    clearDraftStorage();
  }, [clearDraftStorage]);

  return {
    formTitle,
    setFormTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    hasExpiry,
    setHasExpiry,
    expiryDate,
    setExpiryDate,
    isExam,
    setIsExam,
    scheduledAt,
    setScheduledAt,
    allowReset,
    setAllowReset,
    questions,
    setQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    hydrated,
    activeHomeworkId,
    resetForm,
    clearDraftStorage,
  };
}
