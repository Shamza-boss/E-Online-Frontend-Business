'use client';

import React from 'react';
import dayjs from 'dayjs';
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import TimerOffRoundedIcon from '@mui/icons-material/TimerOffRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import type { Question } from '@/app/_lib/interfaces/types';
import { ReviewPaper } from '../elements';

export interface FormBuilderReviewStepProps {
  formTitle: string;
  description: string;
  dueDate: string;
  hasExpiry: boolean;
  expiryDate: string;
  isExam: boolean;
  scheduledAt: string;
  allowReset: boolean;
  questions: Question[];
  totalMarks: number;
  onPrevious: () => void;
  onPublish: () => void;
}

export default function FormBuilderReviewStep({
  formTitle,
  description,
  dueDate,
  hasExpiry,
  expiryDate,
  isExam,
  scheduledAt,
  allowReset,
  questions,
  totalMarks,
  onPrevious,
  onPublish,
}: FormBuilderReviewStepProps) {
  return (
    <ReviewPaper>
      <Box
        sx={(theme) => ({
          borderRadius: Number(theme.shape.borderRadius) * 3 / 8,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          px: { xs: 2.5, sm: 4 },
          py: { xs: 3, sm: 4 },
          background:
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.35)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.light, 0.04)} 100%)`,
        })}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            letterSpacing: '-0.02em',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
            lineHeight: 1.2,
            mb: 1.5,
          }}
        >
          {formTitle || 'Untitled module'}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' }, lineHeight: 1.7, maxWidth: 640 }}
        >
          {description || 'No description provided'}
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          display: 'grid',
          gap: theme.spacing(1.5),
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        })}
      >
        <ReviewStatCard
          icon={<GavelRoundedIcon />}
          paletteKey={isExam ? 'warning' : 'primary'}
          label="Type"
          value={isExam ? 'Exam' : 'Assignment'}
        />
        <ReviewStatCard
          icon={<QuizRoundedIcon />}
          paletteKey="info"
          label="Questions"
          value={`${questions.length} question${questions.length !== 1 ? 's' : ''}`}
        />
        <ReviewStatCard
          icon={<EmojiEventsRoundedIcon />}
          paletteKey="success"
          label="Total Marks"
          value={String(totalMarks)}
        />
      </Box>

      <Box
        sx={(theme) => ({
          borderRadius: Number(theme.shape.borderRadius) * 2.5 / 8,
          border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          overflow: 'hidden',
        })}
      >
        <Box
          sx={(theme) => ({
            px: { xs: 2, sm: 3 },
            py: 1.5,
            backgroundColor: alpha(
              theme.palette.text.primary,
              theme.palette.mode === 'dark' ? 0.06 : 0.03,
            ),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          })}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Schedule &amp; Deadlines
          </Typography>
        </Box>
        <Stack divider={<Divider />}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ px: { xs: 2, sm: 3 }, py: 1.5 }}>
            <CalendarTodayRoundedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Due date
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {dueDate || 'Not set'}
              </Typography>
            </Box>
          </Stack>
          {hasExpiry && (
            <Stack direction="row" alignItems="center" spacing={2} sx={{ px: { xs: 2, sm: 3 }, py: 1.5 }}>
              <TimerOffRoundedIcon sx={{ color: 'warning.main', fontSize: 20 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Expires
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {expiryDate || 'Not set'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  After this date, students can no longer submit.
                </Typography>
              </Box>
            </Stack>
          )}
          {isExam && (
            <Stack direction="row" alignItems="center" spacing={2} sx={{ px: { xs: 2, sm: 3 }, py: 1.5 }}>
              <ScheduleRoundedIcon sx={{ color: 'warning.main', fontSize: 20 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Exam opens
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {scheduledAt
                    ? dayjs(scheduledAt).format('MMMM D, YYYY h:mm A')
                    : 'Immediately on publish'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {scheduledAt
                    ? 'A countdown will be shown until the exam unlocks.'
                    : 'Available to students as soon as you publish.'}
                </Typography>
              </Box>
            </Stack>
          )}
        </Stack>
      </Box>

      {(isExam || allowReset) && (
        <Box
          sx={(theme) => ({
            borderRadius: Number(theme.shape.borderRadius) * 2.5 / 8,
            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            overflow: 'hidden',
          })}
        >
          <Box
            sx={(theme) => ({
              px: { xs: 2, sm: 3 },
              py: 1.5,
              backgroundColor: alpha(
                theme.palette.text.primary,
                theme.palette.mode === 'dark' ? 0.06 : 0.03,
              ),
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            })}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Behaviour Settings
            </Typography>
          </Box>
          <Stack divider={<Divider />}>
            {isExam && (
              <Stack direction="row" alignItems="center" spacing={2} sx={{ px: { xs: 2, sm: 3 }, py: 1.5 }}>
                <GavelRoundedIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    Exam mode
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    Enabled
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Fullscreen enforced. Notes, resources, and navigation disabled.
                  </Typography>
                </Box>
              </Stack>
            )}
            {allowReset && (
              <Stack direction="row" alignItems="center" spacing={2} sx={{ px: { xs: 2, sm: 3 }, py: 1.5 }}>
                <ReplayRoundedIcon sx={{ color: 'info.main', fontSize: 20 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    Reset / Re-attempt
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    Allowed
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Students can clear their submission and start fresh. Each attempt is tracked.
                  </Typography>
                </Box>
              </Stack>
            )}
          </Stack>
        </Box>
      )}

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        spacing={2}
        mt={{ xs: 1, sm: 3 }}
      >
        <Button onClick={onPrevious} variant="outlined">
          Back to questions
        </Button>
        <Button
          onClick={onPublish}
          color="success"
          variant="contained"
          size="large"
          startIcon={<PlayArrowRoundedIcon />}
          sx={{ fontWeight: 700, px: 5, py: 1.5, fontSize: '1rem', borderRadius: 2 }}
        >
          Confirm and publish
        </Button>
      </Stack>
    </ReviewPaper>
  );
}

interface ReviewStatCardProps {
  icon: React.ReactNode;
  paletteKey: 'primary' | 'warning' | 'info' | 'success';
  label: string;
  value: string;
}

function ReviewStatCard({ icon, paletteKey, label, value }: ReviewStatCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: { xs: 2, sm: 2.5 },
        py: { xs: 1.75, sm: 2 },
        borderRadius: Number(theme.shape.borderRadius) * 2.5 / 8,
        borderColor: alpha(theme.palette[paletteKey].main, 0.25),
        backgroundColor: alpha(
          theme.palette[paletteKey].main,
          theme.palette.mode === 'dark' ? 0.08 : 0.04,
        ),
      })}
    >
      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 42,
          height: 42,
          borderRadius: '50%',
          backgroundColor: alpha(theme.palette[paletteKey].main, 0.15),
          color: theme.palette[paletteKey].main,
          flexShrink: 0,
          '& .MuiSvgIcon-root': { fontSize: 22 },
        })}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          textTransform="uppercase"
          fontWeight={600}
          sx={{ letterSpacing: '0.04em', fontSize: '0.7rem' }}
        >
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={700} noWrap>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}
