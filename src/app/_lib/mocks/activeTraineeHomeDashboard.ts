import type { TraineeHomeDashboardDto } from '@/app/_lib/types/dashboardHome';
import type { TraineeActivityInsightDto } from '@/app/_lib/types/dashboardInsights';
import { daysAgoIso, daysFromNowIso, risingSeries, uuid } from './mockHelpers';

const CLASS_MATH = {
  classroomId: uuid(901),
  classroomName: 'Grade 11 · Mathematics',
};
const CLASS_ENG = {
  classroomId: uuid(902),
  classroomName: 'Grade 11 · English HL',
};
const CLASS_IT = {
  classroomId: uuid(903),
  classroomName: 'Grade 10 · IT / Coding',
};
const CLASS_ACC = {
  classroomId: uuid(904),
  classroomName: 'Grade 12 · Accounting',
};

/**
 * Engaged trainee: solid grades, light overdue pressure, clear upcoming work + exam.
 */
export const ACTIVE_TRAINEE_HOME_DASHBOARD: TraineeHomeDashboardDto = {
  dueSoonCount: 6,
  overdueCount: 1,
  myAverageGrade: 82,
  mySubmissionRate: 0.89,
  nextExamTitle: 'Mathematics mid-term',
  nextExamScheduledAt: daysFromNowIso(11, 9),
  nextDue: [
    {
      assignmentId: uuid(301),
      title: 'Calculus checkpoint — derivatives',
      dueDate: daysFromNowIso(1),
      isOverdue: false,
      isExam: false,
      ...CLASS_MATH,
    },
    {
      assignmentId: uuid(302),
      title: 'Persuasive essay draft',
      dueDate: daysFromNowIso(2),
      isOverdue: false,
      isExam: false,
      ...CLASS_ENG,
    },
    {
      assignmentId: uuid(303),
      title: 'Python loops & lists sprint',
      dueDate: daysFromNowIso(3),
      isOverdue: false,
      isExam: false,
      ...CLASS_IT,
    },
    {
      assignmentId: uuid(304),
      title: 'Genetics case study',
      dueDate: daysFromNowIso(5),
      isOverdue: false,
      isExam: false,
      classroomId: uuid(905),
      classroomName: 'Grade 11 · Life Sciences',
    },
    {
      assignmentId: uuid(305),
      title: 'Poetry annotation set',
      dueDate: daysFromNowIso(6),
      isOverdue: false,
      isExam: false,
      ...CLASS_ENG,
    },
    {
      assignmentId: uuid(306),
      title: 'Mathematics mid-term',
      dueDate: daysFromNowIso(11, 9),
      isOverdue: false,
      isExam: true,
      ...CLASS_MATH,
    },
    {
      assignmentId: uuid(307),
      title: 'Trial balance practice set',
      dueDate: daysAgoIso(2),
      isOverdue: true,
      isExam: false,
      ...CLASS_ACC,
    },
  ],
};

function dailyEventRows(
  length = 30,
): NonNullable<TraineeActivityInsightDto['dailyEvents']> {
  const counts = risingSeries(length, 2, 14, 0.25);
  return counts.map((count, index) => ({
    date: daysAgoIso(length - 1 - index, 12),
    count,
  }));
}

/** Remote “Your activity” insight — event mix + daily engagement. */
export const ACTIVE_TRAINEE_ACTIVITY_INSIGHT: TraineeActivityInsightDto = {
  eventMix: [
    { label: 'Module submits', value: 38 },
    { label: 'Notes', value: 52 },
    { label: 'PDF opens', value: 64 },
    { label: 'Video plays', value: 41 },
    { label: 'Stream joins', value: 12 },
  ],
  dailyEvents: dailyEventRows(30),
};
