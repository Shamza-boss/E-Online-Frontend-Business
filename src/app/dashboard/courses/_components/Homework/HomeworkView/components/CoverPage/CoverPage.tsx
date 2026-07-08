import { Stack, Typography, Button, Divider, Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import TimerOffRoundedIcon from '@mui/icons-material/TimerOffRounded';
import type { Homework, Question } from '../../../../../../../_lib/interfaces/types';
import { extractPlainText } from '@/app/_lib/utils/textUtils';
import { computeTotalWeight } from '../../utils';
import {
  CoverScrollArea,
  HeroBox,
  StatCardsGrid,
  BreakdownContainer,
  BreakdownHeader,
  WeightBadge,
} from '../../elements';
import StatCard from '../StatCard';

export interface CoverPageProps {
  homework: Homework;
  sortedQuestions: Question[];
  totalQuestions: number;
  totalWeight: number;
  readOnly: boolean;
  onStart: () => void;
}

export default function CoverPage({
  homework,
  sortedQuestions,
  totalQuestions,
  totalWeight,
  readOnly,
  onStart,
}: CoverPageProps) {
  const dueDate = format(new Date(Date.parse(homework.dueDate)), 'MMMM d, yyyy');
  const hasExpiry = homework.hasExpiry && homework.expiryDate;
  const expiryDate = hasExpiry
    ? format(new Date(Date.parse(homework.expiryDate!)), 'MMMM d, yyyy')
    : null;

  return (
    <CoverScrollArea>
      <Stack spacing={4} sx={{ width: '100%', maxWidth: 860 }}>
        <HeroBox>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
              lineHeight: 1.2,
              mb: homework.description ? 1.5 : 0,
            }}
          >
            {homework.title}
          </Typography>
          {homework.description && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1.05rem' },
                lineHeight: 1.7,
                maxWidth: 640,
              }}
            >
              {homework.description}
            </Typography>
          )}
        </HeroBox>

        <StatCardsGrid
          sx={{
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: `repeat(${expiryDate ? 4 : 3}, 1fr)`,
            },
          }}
        >
          <StatCard
            icon={<CalendarTodayRoundedIcon />}
            label="Due Date"
            value={dueDate}
            color="primary"
          />
          {expiryDate && (
            <StatCard
              icon={<TimerOffRoundedIcon />}
              label="Expires"
              value={expiryDate}
              color="warning"
            />
          )}
          <StatCard
            icon={<QuizRoundedIcon />}
            label="Questions"
            value={String(totalQuestions)}
            color="info"
          />
          <StatCard
            icon={<EmojiEventsRoundedIcon />}
            label="Total Marks"
            value={String(totalWeight)}
            color="success"
          />
        </StatCardsGrid>

        {homework.isExam && homework.scheduledAt && (() => {
          const start = new Date(homework.scheduledAt);
          const end = new Date(start.getTime() + 60 * 60 * 1000);
          const fmt = (d: Date) =>
            d.toISOString().replaceAll(/[-:]/g, '').replace(/\.\d{3}/, '');
          const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(homework.title)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(homework.description || '')}`;
          return (
            <Button
              variant="outlined"
              size="small"
              startIcon={<CalendarTodayRoundedIcon />}
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
            >
              Add to Google Calendar
            </Button>
          );
        })()}

        {sortedQuestions.length > 0 && (
          <BreakdownContainer>
            <BreakdownHeader>
              <Typography variant="subtitle1" fontWeight={700}>
                Question Breakdown
              </Typography>
            </BreakdownHeader>
            <Stack divider={<Divider />}>
              {sortedQuestions.map((q, i) => {
                const label = extractPlainText(q.questionText) || `Question ${i + 1}`;
                const weight = computeTotalWeight(q);
                return (
                  <Stack
                    key={q.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      px: { xs: 2, sm: 3 },
                      py: 1.25,
                      '&:hover': {
                        backgroundColor: (theme) =>
                          alpha(theme.palette.action.hover, 0.04),
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      }}
                    >
                      <Box
                        component="span"
                        fontWeight={700}
                        sx={{ mr: 0.75, color: 'text.secondary' }}
                      >
                        {i + 1}.
                      </Box>
                      {label}
                    </Typography>
                    <WeightBadge>
                      {weight} {weight === 1 ? 'mark' : 'marks'}
                    </WeightBadge>
                  </Stack>
                );
              })}
            </Stack>
          </BreakdownContainer>
        )}

        {!readOnly && totalQuestions > 0 && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<PlayArrowRoundedIcon />}
            onClick={onStart}
            sx={{
              alignSelf: { xs: 'stretch', sm: 'flex-start' },
              fontWeight: 700,
              px: 5,
              py: 1.5,
              fontSize: '1rem',
              borderRadius: 2,
            }}
          >
            Begin Assessment
          </Button>
        )}
      </Stack>
    </CoverScrollArea>
  );
}
