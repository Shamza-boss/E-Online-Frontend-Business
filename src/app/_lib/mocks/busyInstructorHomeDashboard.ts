import type {
  HeavyLoadStudentDto,
  InstructorHomeDashboardDto,
  TeacherModuleActionDto,
  UnassignedStudentDto,
} from '@/app/_lib/types/dashboardHome';
import type {
  InstructorHeavyLoadInsightDto,
  InstructorUnassignedInsightDto,
  InstructorWorkloadInsightDto,
} from '@/app/_lib/types/dashboardInsights';
import { daysAgoIso, daysFromNowIso, uuid } from './mockHelpers';

const action = (
  partial: Omit<TeacherModuleActionDto, 'homeworkId'> & { homeworkId?: string },
): TeacherModuleActionDto => ({
  homeworkId: partial.homeworkId ?? uuid(Math.floor(Math.random() * 900) + 100),
  title: partial.title,
  classroomId: partial.classroomId ?? uuid(501),
  classroomName: partial.classroomName ?? 'Carryless course',
  status: partial.status,
  relevantAt: partial.relevantAt,
  isExam: partial.isExam ?? false,
});

const unassignedStudents: UnassignedStudentDto[] = [
  {
    userId: uuid(401),
    firstName: 'Maya',
    lastName: 'Chen',
    email: 'maya.chen@crestview.edu',
    lastSeenAt: daysAgoIso(2),
  },
  {
    userId: uuid(402),
    firstName: 'Omar',
    lastName: 'Hassan',
    email: 'omar.hassan@crestview.edu',
    lastSeenAt: null,
  },
  {
    userId: uuid(403),
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.nair@crestview.edu',
    lastSeenAt: daysAgoIso(12),
  },
  {
    userId: uuid(404),
    firstName: 'Leo',
    lastName: 'Martinez',
    email: 'leo.martinez@crestview.edu',
    lastSeenAt: daysAgoIso(5),
  },
];

const heavyLoadStudents: HeavyLoadStudentDto[] = [
  {
    userId: uuid(201),
    firstName: 'Lebo',
    lastName: 'Maseko',
    email: 'lebo.maseko@crestview.edu',
    peakDueCount: 6,
    classCount: 4,
    peakWindowStart: daysFromNowIso(1),
    peakWindowEnd: daysFromNowIso(6),
    reason: '6 dues in 7 days across 4 class(es)',
  },
  {
    userId: uuid(202),
    firstName: 'Anika',
    lastName: 'Pillay',
    email: 'anika.pillay@crestview.edu',
    peakDueCount: 5,
    classCount: 3,
    peakWindowStart: daysFromNowIso(2),
    peakWindowEnd: daysFromNowIso(7),
    reason: '5 dues in 7 days across 3 class(es)',
  },
  {
    userId: uuid(203),
    firstName: 'Chris',
    lastName: 'Vogel',
    email: 'chris.vogel@crestview.edu',
    peakDueCount: 4,
    classCount: 4,
    peakWindowStart: daysFromNowIso(0),
    peakWindowEnd: daysFromNowIso(5),
    reason: '4 dues in 7 days across 4 class(es)',
  },
  {
    userId: uuid(208),
    firstName: 'Hana',
    lastName: 'Singh',
    email: 'hana.singh@crestview.edu',
    peakDueCount: 4,
    classCount: 2,
    peakWindowStart: daysFromNowIso(3),
    peakWindowEnd: daysFromNowIso(8),
    reason: '4 dues in 7 days across 2 class(es)',
  },
];

export const BUSY_INSTRUCTOR_HOME_DASHBOARD: InstructorHomeDashboardDto = {
  draftCount: 5,
  expiredDraftCount: 2,
  scheduledExamCount: 3,
  expiringSoonCount: 2,
  mySubmissionRate: 0.84,
  activeTraineesLast7Days: 118,
  unassignedStudentCount: unassignedStudents.length,
  heavyLoadStudentCount: heavyLoadStudents.length,
  actionItems: [
    action({
      homeworkId: uuid(301),
      title: 'Algebra review pack',
      status: 'ExpiredDraft',
      relevantAt: daysAgoIso(3),
    }),
    action({
      homeworkId: uuid(302),
      title: 'Mechanics practice set',
      status: 'ExpiredDraft',
      relevantAt: daysAgoIso(1),
    }),
    action({
      homeworkId: uuid(303),
      title: 'Electricity quiz window',
      status: 'ExpiringSoon',
      relevantAt: daysFromNowIso(1),
    }),
    action({
      homeworkId: uuid(304),
      title: 'Genetics case study',
      status: 'ExpiringSoon',
      relevantAt: daysFromNowIso(4),
    }),
    action({
      homeworkId: uuid(305),
      title: 'Mathematics mid-term',
      status: 'ScheduledExam',
      relevantAt: daysFromNowIso(2),
      isExam: true,
    }),
    action({
      homeworkId: uuid(306),
      title: 'Lit Paper 2 timed response',
      status: 'ScheduledExam',
      relevantAt: daysFromNowIso(6),
      isExam: true,
    }),
    action({
      homeworkId: uuid(307),
      title: 'Python loops sprint (draft)',
      status: 'Draft',
      relevantAt: daysAgoIso(2),
    }),
    action({
      homeworkId: uuid(308),
      title: 'Cash flow workshop draft',
      status: 'Draft',
      relevantAt: daysAgoIso(8),
    }),
  ],
  atRiskTrainees: [
    {
      userId: uuid(211),
      firstName: 'Nandi',
      lastName: 'Zulu',
      email: 'nandi.zulu@crestview.edu',
      reason: 'No activity in 7 days',
      lastSeenAt: daysAgoIso(22),
    },
    {
      userId: uuid(212),
      firstName: 'James',
      lastName: 'Okello',
      email: 'james.okello@crestview.edu',
      reason: 'Overdue unsubmitted work',
      lastSeenAt: daysAgoIso(5),
    },
    {
      userId: uuid(213),
      firstName: 'Sara',
      lastName: 'Bennet',
      email: 'sara.bennet@crestview.edu',
      reason: 'Never logged in',
      lastSeenAt: null,
    },
    {
      userId: uuid(214),
      firstName: 'Tumi',
      lastName: 'Radebe',
      email: 'tumi.radebe@crestview.edu',
      reason: 'No activity in 7 days',
      lastSeenAt: daysAgoIso(11),
    },
  ],
  unassignedStudents,
  heavyLoadStudents,
};

export const BUSY_INSTRUCTOR_WORKLOAD_INSIGHT: InstructorWorkloadInsightDto = {
  expiredDrafts: BUSY_INSTRUCTOR_HOME_DASHBOARD.actionItems.filter(
    (i) => i.status === 'ExpiredDraft',
  ),
  expiringSoon: BUSY_INSTRUCTOR_HOME_DASHBOARD.actionItems.filter(
    (i) => i.status === 'ExpiringSoon',
  ),
  scheduledExams: [
    ...BUSY_INSTRUCTOR_HOME_DASHBOARD.actionItems.filter(
      (i) => i.status === 'ScheduledExam',
    ),
    action({
      homeworkId: uuid(309),
      title: 'Chemistry practical window',
      status: 'ScheduledExam',
      relevantAt: daysFromNowIso(12),
      isExam: true,
    }),
  ],
  drafts: [
    ...BUSY_INSTRUCTOR_HOME_DASHBOARD.actionItems.filter((i) => i.status === 'Draft'),
    action({
      homeworkId: uuid(310),
      title: 'Ecology journal outline',
      status: 'Draft',
      relevantAt: daysAgoIso(14),
    }),
    action({
      homeworkId: uuid(311),
      title: 'Trig identities pack',
      status: 'Draft',
      relevantAt: daysAgoIso(1),
    }),
    action({
      homeworkId: uuid(312),
      title: 'Accounting trial balance',
      status: 'Draft',
      relevantAt: daysAgoIso(5),
    }),
  ],
};

export const BUSY_INSTRUCTOR_UNASSIGNED_INSIGHT: InstructorUnassignedInsightDto =
  {
    students: [
      ...unassignedStudents,
      {
        userId: uuid(405),
        firstName: 'Noah',
        lastName: 'Kim',
        email: 'noah.kim@crestview.edu',
        lastSeenAt: daysAgoIso(1),
      },
    ],
  };

export const BUSY_INSTRUCTOR_HEAVY_LOAD_INSIGHT: InstructorHeavyLoadInsightDto =
  {
    students: heavyLoadStudents,
  };
