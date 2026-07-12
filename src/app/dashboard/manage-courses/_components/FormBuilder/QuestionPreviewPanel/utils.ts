import { alpha, type Theme } from '@mui/material/styles';
import type { Question } from '@/app/_lib/interfaces/types';
import type { PreviewTone, ToneStyle } from './types';

export const getPreviewTone = (
  type: Question['type'],
  depth: number
): PreviewTone => {
  if (type === 'pdf') return 'pdf';
  if (type === 'video') return 'video';
  if (type === 'group') return 'group';
  if (depth > 1) return 'subquestion';
  return 'question';
};

export const getToneStyle = (theme: Theme, tone: PreviewTone): ToneStyle => {
  let label = 'Question';
  let accent = theme.palette.primary.main;

  if (tone === 'pdf') {
    label = 'PDF Section';
    accent = theme.palette.warning.main;
  } else if (tone === 'video') {
    label = 'Video Section';
    accent = theme.palette.info.main;
  } else if (tone === 'group') {
    label = 'Grouped Question';
    accent = theme.palette.secondary.main;
  } else if (tone === 'subquestion') {
    label = 'Subquestion';
    accent = theme.palette.text.secondary;
  }

  const strongOnDark = theme.palette.mode === 'dark' ? 0.42 : 0.3;
  const softOnDark = theme.palette.mode === 'dark' ? 0.2 : 0.08;

  return {
    label,
    accentColor: accent,
    borderColor: alpha(accent, strongOnDark),
    backgroundColor: alpha(accent, softOnDark),
  };
};
