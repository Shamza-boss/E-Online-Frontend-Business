import type { Question } from '@/app/_lib/interfaces/types';

export const QUESTION_TYPES = [
  { value: 'video', label: 'Video Section' },
  { value: 'pdf', label: 'PDF Section' },
  { value: 'single-select', label: 'Single Choice' },
  { value: 'multi-select', label: 'Multiple Choice' },
] as const;

export const FORM_STORAGE_KEY = 'form_builder_homework_draft_v1';
export const LEGACY_FORM_STORAGE_KEY = 'form_builder_modal_state_v3';
export const BUILDER_STEPS = [
  'Module details',
  'Create questions',
  'Review and publish',
] as const;
export const HOMEWORK_DRAFT_IDLE_MS = 1000;
