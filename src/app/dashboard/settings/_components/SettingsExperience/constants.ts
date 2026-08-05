import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import type {
  AccessMode,
  AccessModeMeta,
  RoleGuidanceCard,
  ViewGuidanceEntry,
} from './types';

export const SETTINGS_TITLE = 'Settings & Guidance';
export const SETTINGS_DESCRIPTION =
  'Update your profile, review role-specific insights, and browse guidance for each dashboard area.';

export const TAB_ITEMS = [
  {
    value: 'profile',
    label: 'Profile Settings',
    helper: 'Update your display name and review secure account info.',
  },
  {
    value: 'insights',
    label: 'Role Insights',
    helper: 'Review KPIs, ratings, and graphs generated for your role.',
  },
  {
    value: 'guidance',
    label: 'Guidance Center',
    helper:
      'Understand every role on Absolute Online and what each area of the dashboard enables.',
  },
  {
    value: 'legal',
    label: 'Terms & Privacy',
    helper: 'Review our terms of service and privacy policy.',
  },
] as const;

export const COMPACT_METRIC_NUMBER = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const ROLE_GUIDANCE: RoleGuidanceCard[] = [
  {
    title: 'Institution Admin',
    role: UserRole.Admin,
    summary:
      'Oversees a single institution. Sets up classrooms, teachers, and subscription preferences.',
    actions: [
      'Provision instructors and trainees',
      'Manage subscription tiers & payments',
      'Approve or archive classrooms',
      'Monitor institution level analytics',
    ],
  },
  {
    title: 'Instructor',
    role: UserRole.Instructor,
    summary:
      'Delivers learning experiences. Owns classrooms, assignments, grading, and live sessions.',
    actions: [
      'Create test modules, notes, and resources',
      'Track class progress & engagement',
      'Give qualitative and numeric feedback',
    ],
  },
  {
    title: 'Trainee',
    role: UserRole.Trainee,
    summary:
      'Learns within assigned classrooms. Engages with notes, modules, and live events.',
    actions: [
      'Submit modules/quizzes',
      'Collaborate in shared notes',
      'Track personal progress',
      'Access institution resources safely',
    ],
  },
];

export const VIEW_GUIDANCE: ViewGuidanceEntry[] = [
  {
    title: 'Dashboard Overview',
    description:
      'Surface-level pulse cards, upcoming sessions, and reminders. Everyone lands here after sign in.',
    capabilities: [
      {
        role: UserRole.Admin,
        capability: 'Calibrate KPI widgets & alerts',
        detail: 'Admins can re-order cards, pin revenue widgets, and set alert thresholds for the org.',
        mode: 'govern',
      },
      {
        role: UserRole.Instructor,
        capability: 'Track workload health',
        detail: 'Instructors acknowledge action items and clear blockers surfaced on their cards.',
        mode: 'view',
      },
      {
        role: UserRole.Trainee,
        capability: 'Review upcoming tasks',
        detail: 'Trainees mark study streaks complete but cannot adjust widgets for others.',
        mode: 'view',
      },
    ],
  },
  {
    title: 'Management Suite',
    description:
      'Full CRUD workspace for institutions, classrooms, academics, and people records.',
    capabilities: [
      {
        role: UserRole.Admin,
        capability: 'Create & archive entities',
        detail: 'Admins provision institutions, classrooms, people, and academic levels.',
        mode: 'create',
      },
      {
        role: UserRole.Instructor,
        capability: 'Verify assigned rosters',
        detail: 'Instructors can view academic records and request edits but cannot modify system-wide data.',
        mode: 'view',
      },
      {
        role: UserRole.Trainee,
        capability: 'No access',
        detail: 'Protects students from editing sensitive institution data.',
        mode: 'none',
      },
    ],
  },
  {
    title: 'Library & Notes',
    description:
      'Centralized storage for PDF packs, math builders, and collaborative notes.',
    capabilities: [
      {
        role: UserRole.Admin,
        capability: 'Approve institution packs',
        detail: 'Admins publish branded study packs and manage storage policies.',
        mode: 'govern',
      },
      {
        role: UserRole.Instructor,
        capability: 'Create lessons & uploads',
        detail: 'Instructors author notes, attach media, and curate course libraries.',
        mode: 'create',
      },
      {
        role: UserRole.Trainee,
        capability: 'Annotate personal notes',
        detail: 'Trainees download resources, add private annotations, and sync study notes.',
        mode: 'complete',
      },
    ],
  },
  {
    title: 'Assignments & Streams',
    description:
      'Homework distribution, grading, streaming, and attendance is coordinated here.',
    capabilities: [
      {
        role: UserRole.Admin,
        capability: 'Override grading windows',
        detail: 'Admins monitor compliance, reopen modules, and escalate missed grading cycles.',
        mode: 'govern',
      },
      {
        role: UserRole.Instructor,
        capability: 'Create modules & grade work',
        detail: 'Instructors build homework, host live streams, and score submissions.',
        mode: 'create',
      },
      {
        role: UserRole.Trainee,
        capability: 'Complete modules & submit',
        detail: 'Trainees upload assignments, join sessions, and mark coursework complete.',
        mode: 'complete',
      },
    ],
  },
];

export const ROCKET_POSITIONS = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  top: (index * 37) % 100,
  left: (index * 19) % 100,
  depth: 0.25 + ((index % 4) * 0.2),
}));

export const MATRIX_ROLES: UserRole[] = [
  UserRole.Admin,
  UserRole.Instructor,
  UserRole.Trainee,
];

export const ACCESS_MODE_META_MAP: Record<AccessMode, AccessModeMeta> = {
  govern: {
    label: 'Govern settings',
    color: 'warning',
    variant: 'filled',
    Icon: GavelOutlinedIcon,
  },
  create: {
    label: 'Create / edit',
    color: 'success',
    variant: 'filled',
    Icon: BuildOutlinedIcon,
  },
  complete: {
    label: 'Complete items',
    color: 'info',
    variant: 'filled',
    Icon: TaskAltOutlinedIcon,
  },
  view: {
    label: 'View only',
    color: 'default',
    variant: 'outlined',
    Icon: VisibilityOutlinedIcon,
  },
  none: {
    label: 'No access',
    color: 'error',
    variant: 'outlined',
    Icon: BlockOutlinedIcon,
  },
};
