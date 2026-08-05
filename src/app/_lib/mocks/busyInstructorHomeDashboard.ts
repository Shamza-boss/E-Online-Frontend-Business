import type { InstructorHomeDashboardDto } from '@/app/_lib/types/dashboardHome';
import type { InstructorWorkloadInsightDto } from '@/app/_lib/types/dashboardInsights';
import { daysAgoIso, daysFromNowIso, uuid } from './mockHelpers';

/**
 * Busy but healthy instructor class load:
 * meaningful grading queue, strong class submission, a short at-risk list.
 */
export const BUSY_INSTRUCTOR_HOME_DASHBOARD: InstructorHomeDashboardDto = {
  pendingToGradeCount: 27,
  mySubmissionRate: 0.84,
  activeTraineesLast7Days: 118,
  upcomingDueCount: 14,
  atRiskTrainees: [
    {
      userId: uuid(201),
      firstName: 'Lebo',
      lastName: 'Maseko',
      email: 'lebo.maseko@crestview.edu',
      reason: 'No submission in 14 days',
      lastSeenAt: daysAgoIso(16),
    },
    {
      userId: uuid(202),
      firstName: 'Anika',
      lastName: 'Pillay',
      email: 'anika.pillay@crestview.edu',
      reason: 'Missed 2 consecutive modules',
      lastSeenAt: daysAgoIso(9),
    },
    {
      userId: uuid(203),
      firstName: 'Chris',
      lastName: 'Vogel',
      email: 'chris.vogel@crestview.edu',
      reason: 'Average grade dropped 18%',
      lastSeenAt: daysAgoIso(3),
    },
    {
      userId: uuid(204),
      firstName: 'Nandi',
      lastName: 'Zulu',
      email: 'nandi.zulu@crestview.edu',
      reason: 'Inactive for 21 days',
      lastSeenAt: daysAgoIso(22),
    },
    {
      userId: uuid(205),
      firstName: 'James',
      lastName: 'Okello',
      email: 'james.okello@crestview.edu',
      reason: 'Overdue exam prep module',
      lastSeenAt: daysAgoIso(5),
    },
    {
      userId: uuid(206),
      firstName: 'Sara',
      lastName: 'Bennet',
      email: 'sara.bennet@crestview.edu',
      reason: 'Low note activity + late streak',
      lastSeenAt: daysAgoIso(11),
    },
    {
      userId: uuid(207),
      firstName: 'Tumi',
      lastName: 'Radebe',
      email: 'tumi.radebe@crestview.edu',
      reason: 'Never opened current textbook',
      lastSeenAt: daysAgoIso(28),
    },
    {
      userId: uuid(208),
      firstName: 'Hana',
      lastName: 'Singh',
      email: 'hana.singh@crestview.edu',
      reason: '2 overdue assignments',
      lastSeenAt: daysAgoIso(7),
    },
  ],
};

/** Remote workload insight fixture (pending queue + upcoming due). */
export const BUSY_INSTRUCTOR_WORKLOAD_INSIGHT: InstructorWorkloadInsightDto = {
  pendingGradeQueue: [
    {
      assignmentId: uuid(301),
      moduleTitle: 'Calculus checkpoint — derivatives',
      traineeName: 'Lebo Maseko',
      submittedAt: daysAgoIso(1, 14),
    },
    {
      assignmentId: uuid(302),
      moduleTitle: 'Mechanics lab write-up',
      traineeName: 'Anika Pillay',
      submittedAt: daysAgoIso(1, 11),
    },
    {
      assignmentId: uuid(303),
      moduleTitle: 'Persuasive essay draft',
      traineeName: 'Chris Vogel',
      submittedAt: daysAgoIso(2, 16),
    },
    {
      assignmentId: uuid(304),
      moduleTitle: 'Genetics case study',
      traineeName: 'Nandi Zulu',
      submittedAt: daysAgoIso(2, 9),
    },
    {
      assignmentId: uuid(305),
      moduleTitle: 'Python loops & lists sprint',
      traineeName: 'James Okello',
      submittedAt: daysAgoIso(3, 18),
    },
    {
      assignmentId: uuid(306),
      moduleTitle: 'Trial balance practice set',
      traineeName: 'Sara Bennet',
      submittedAt: daysAgoIso(3, 10),
    },
    {
      assignmentId: uuid(307),
      moduleTitle: 'Ecology field journal',
      traineeName: 'Hana Singh',
      submittedAt: daysAgoIso(4, 15),
    },
    {
      assignmentId: uuid(308),
      moduleTitle: 'Trigonometric identities pack',
      traineeName: 'Tumi Radebe',
      submittedAt: daysAgoIso(5, 12),
    },
  ],
  upcomingDue: [
    {
      homeworkId: uuid(401),
      title: 'Electricity tutorial quiz',
      dueDate: daysFromNowIso(2),
      isExam: false,
    },
    {
      homeworkId: uuid(402),
      title: 'Mathematics mid-term',
      dueDate: daysFromNowIso(8, 9),
      isExam: true,
    },
    {
      homeworkId: uuid(403),
      title: 'Lit Paper 2 timed response',
      dueDate: daysFromNowIso(5),
      isExam: true,
    },
    {
      homeworkId: uuid(404),
      title: 'Cash flow statement workshop',
      dueDate: daysFromNowIso(11),
      isExam: false,
    },
  ],
};
