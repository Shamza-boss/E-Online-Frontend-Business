export const PULSE_ANIMATION = {
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
  },
} as const;

export const PULSE_CSS = 'pulse 1.5s ease-in-out infinite';

export const LABEL_COLORS = {
  up: 'success',
  down: 'error',
  neutral: 'default',
} as const;

export const SPARKLINE_HEIGHT = 50;
