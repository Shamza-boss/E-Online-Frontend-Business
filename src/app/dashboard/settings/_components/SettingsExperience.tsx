'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Box,
    Button,
    Collapse,
    Container,
    Divider,
    IconButton,
    Paper,
    Stack,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import { alpha, useTheme, type Theme } from '@mui/material/styles';
import type { ChipProps } from '@mui/material/Chip';
import { RoleChip } from '@/app/_lib/components/role/roleChip';
import { getRoleChipConfig } from '@/app/_lib/common/functions';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { LineChart, BarChart } from '@mui/x-charts';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ProfileSettingsCard, {
    type ProfileSettingsUser,
    formatRoleLabel,
} from './profile/ProfileSettingsCard';
import SubscriptionSettingsPanel from './subscription/SubscriptionSettingsPanel';
import type {
    SettingsResponseDto,
    SettingsStatsDto,
    StatsGraphDto,
} from '@/app/_lib/interfaces/types';

const MotionBox = motion(Box);

type ChipTone = ChipProps['color'];

interface RoleGuidanceCard {
    title: string;
    role: UserRole;
    summary: string;
    actions: string[];
}

interface SettingsExperienceProps {
    data: SettingsResponseDto;
}

type Pointer = { x: number; y: number };

type RoleKey = UserRole | 'default';

interface RoleTheme {
    chipColor: ChipTone;
    accent: string;
    gradient: string;
    surface: string;
    border: string;
}


const tabItems = [
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
];

const compactMetricNumber = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
});

const roleGuidance: RoleGuidanceCard[] = [
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
            'Create homework, notes, and resources',
            'Track class progress & engagement',
            'Host live streams or sessions',
            'Give qualitative and numeric feedback',
        ],
    },
    {
        title: 'Trainee',
        role: UserRole.Trainee,
        summary:
            'Learns within assigned classrooms. Engages with notes, homework, and live events.',
        actions: [
            'Submit homework & quizzes',
            'Collaborate in shared notes',
            'Track personal progress',
            'Download institution resources safely',
        ],
    },
];

type AccessMode = 'govern' | 'create' | 'complete' | 'view' | 'none';

interface ViewCapability {
    role: UserRole;
    capability: string;
    detail: string;
    mode: AccessMode;
}

interface ViewGuidanceEntry {
    title: string;
    description: string;
    capabilities: ViewCapability[];
}

const viewGuidance: ViewGuidanceEntry[] = [
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

const rocketPositions = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    top: (index * 37) % 100,
    left: (index * 19) % 100,
    depth: 0.25 + ((index % 4) * 0.2),
}));

export default function SettingsExperience({ data }: SettingsExperienceProps) {
    const { user, stats } = data;
    const roleValue = extractRoleValue(user.role);
    const theme = useTheme();
    const resolvedUserRole = resolveUserRole(user.role);
    const roleLabel = resolvedUserRole !== null
        ? getRoleChipConfig(resolvedUserRole).label
        : roleValue
            ? formatRoleLabel(roleValue)
            : 'Member';
    const roleKey: RoleKey = resolvedUserRole ?? 'default';
    const roleTheme = React.useMemo(() => buildRoleTheme(roleKey, theme), [roleKey, theme]);
    const profileUser: ProfileSettingsUser = {
        userId: user.userId,
        email: user.email ?? '',
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        role: roleLabel,
        institutionName: user.institutionName ?? null,
    };

    const [tab, setTab] = React.useState('profile');
    const [pointer, setPointer] = React.useState<Pointer>({ x: 0, y: 0 });
    const handleTabChange = React.useCallback(
        (_: React.SyntheticEvent, value: string) => {
            setTab(value);
        },
        []
    );

    const handlePointerMove = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            setPointer({ x, y });
        },
        []
    );

    const handlePointerLeave = React.useCallback(() => {
        setPointer({ x: 0, y: 0 });
    }, []);

    return (
        <Box
            component="section"
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                minHeight: 0,
                py: { xs: 6, md: 10 },
                px: { xs: 1.5, md: 4 },
            }}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            <RocketBackdrop pointer={pointer} />
            <Container
                maxWidth="lg"
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0,
                }}
            >
                <Stack spacing={2} sx={{ flexGrow: 1, minHeight: 0 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <Box
                                component="img"
                                src="/assets/absolute-rocket.webp"
                                alt="Absolute Online rocket"
                                sx={{ width: 110, height: 110, opacity: 0.9 }}
                            />
                            <Box>
                                <Typography
                                    variant="overline"
                                    fontWeight={700}
                                    letterSpacing={2}
                                    sx={{ color: roleTheme.accent }}
                                >
                                    Absolute Online PTY LTD
                                </Typography>
                                <Typography variant="h4" fontWeight={700} lineHeight={1.2}>
                                    Settings & Guidance Center
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>
                    <Typography variant="body1" color="text.secondary">
                        Start with your personal profile, dive into Role Insights to see KPIs generated just for you,
                        and reference Guidance whenever you need a refresher on capabilities per role. Nothing in this
                        workspace will delete or hide your account details.
                    </Typography>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        allowScrollButtonsMobile
                        sx={{ maxWidth: '100%' }}
                    >
                        {tabItems.map((item) => (
                            <Tab
                                key={item.value}
                                value={item.value}
                                label={
                                    <Box textAlign="left">
                                        <Typography fontWeight={700}>{item.label}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.helper}
                                        </Typography>
                                    </Box>
                                }
                            />
                        ))}
                    </Tabs>
                    <Divider flexItem sx={{ opacity: 0.2 }} />
                    <Box sx={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                        <Box
                            sx={{
                                flexGrow: 1,
                                minHeight: 0,
                                overflowY: { xs: 'visible', md: 'auto' },
                                pr: { md: 1 },
                                pb: 2,
                            }}
                        >
                            <Stack spacing={2}>
                                {tab === 'profile' ? (
                                    <>
                                        <ProfileSettingsCard user={profileUser} />
                                        <SubscriptionSettingsPanel />
                                    </>
                                ) : null}
                                {tab === 'insights' && (
                                    <InsightsPanel stats={stats} roleTheme={roleTheme} roleLabel={roleLabel} />
                                )}
                                {tab === 'guidance' && <GuidancePanel activeRole={resolvedUserRole} />}
                            </Stack>
                        </Box>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}

interface InsightsPanelProps {
    stats: SettingsStatsDto;
    roleTheme: RoleTheme;
    roleLabel: string;
}

function InsightsPanel({ stats, roleTheme, roleLabel }: InsightsPanelProps) {
    const kpiEntries = Object.entries(stats?.kpis ?? {});
    const extraEntries = Object.entries(stats?.extra ?? {});
    const graphs = stats?.graphs ?? [];

    return (
        <Stack spacing={4}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    background: roleTheme.gradient,
                    border: `1px solid ${roleTheme.border}`,
                }}
            >
                <Stack spacing={1.5}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                        <Typography variant="h5" fontWeight={700} flex={1}>
                            Role insights for {roleLabel}
                        </Typography>
                        {stats.rating ? (
                            <Chip
                                label={stats.rating}
                                color={roleTheme.chipColor}
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                            />
                        ) : undefined}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                        {stats.explanation}
                    </Typography>
                </Stack>
            </Paper>

            {kpiEntries.length ? (
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap">
                    {kpiEntries.map(([key, value]) => (
                        <Paper
                            key={key}
                            elevation={0}
                            sx={{
                                flex: 1,
                                minWidth: 220,
                                p: 3,
                                borderRadius: 4,
                                border: `1px solid ${roleTheme.border}`,
                                backgroundColor: roleTheme.surface,
                            }}
                        >
                            <Typography variant="caption" textTransform="uppercase" color="text.secondary">
                                {formatMetricKey(key)}
                            </Typography>
                            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                                {formatMetricValue(key, value)}
                            </Typography>
                        </Paper>
                    ))}
                </Stack>
            ) : (
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        No KPIs yet for this role. Complete more activity to unlock insights.
                    </Typography>
                </Paper>
            )}

            {graphs.length ? (
                <Stack spacing={3}>
                    {graphs.map((graph) => (
                        <StatsGraphCard key={graph.id} graph={graph} roleTheme={roleTheme} />
                    ))}
                </Stack>
            ) : (
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        Graphs will appear here once we have enough data to visualize trends.
                    </Typography>
                </Paper>
            )}

            {extraEntries.length ? (
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                        Extra details
                    </Typography>
                    <Stack spacing={1.5}>
                        {extraEntries.map(([key, value]) => (
                            <Stack key={key} direction="row" spacing={1} justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                    {formatMetricKey(key)}
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {String(value)}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Paper>
            ) : null}
        </Stack>
    );
}

function StatsGraphCard({ graph, roleTheme }: { graph: StatsGraphDto; roleTheme: RoleTheme }) {
    const series = graph?.series ?? [];
    const hasData = series.length && series.some((serie) => serie.values.length);
    const isTrend = graph.id.toLowerCase().includes('trend') || graph.x.length > 8;
    const theme = useTheme();
    const palette = React.useMemo(() => getChartPalette(roleTheme.accent, theme), [roleTheme.accent, theme]);

    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
            <Stack spacing={1.5}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        {graph.title}
                    </Typography>
                    {graph.description ? (
                        <Typography variant="body2" color="text.secondary">
                            {graph.description}
                        </Typography>
                    ) : undefined}
                </Box>
                {hasData ? (
                    isTrend ? (
                        <LineChart
                            height={320}
                            xAxis={[{ data: graph.x, scaleType: 'point' }]}
                            series={series.map((serie, idx) => ({
                                data: serie.values,
                                label: serie.name,
                                color: palette[idx % palette.length],
                                area: true,
                            }))}
                            margin={{ left: 40, right: 20, top: 20, bottom: 40 }}
                        />
                    ) : (
                        <BarChart
                            height={320}
                            xAxis={[{ scaleType: 'band', data: graph.x }]}
                            series={series.map((serie, idx) => ({
                                data: serie.values,
                                label: serie.name,
                                color: palette[idx % palette.length],
                            }))}
                            margin={{ left: 30, right: 10, top: 20, bottom: 40 }}
                        />
                    )
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Not enough data yet to render this visualization.
                    </Typography>
                )}
            </Stack>
        </Paper>
    );
}

function extractRoleValue(role: SettingsResponseDto['user']['role']): string | null {
    if (role === null || role === undefined) return null;
    if (typeof role === 'number') {
        switch (role) {
            case -1:
                return 'Platform Admin';
            case 0:
                return 'Admin';
            case 1:
                return 'Student';
            case 2:
                return 'Teacher';
            default:
                return role.toString();
        }
    }
    return role ? role.toString() : null;
}

function resolveUserRole(role: SettingsResponseDto['user']['role']): UserRole | null {
    if (role === null || role === undefined) return null;
    if (typeof role === 'number') {
        switch (role) {
            case UserRole.PlatformAdmin:
            case UserRole.Admin:
            case UserRole.Trainee:
            case UserRole.Instructor:
                return role;
            default:
                return null;
        }
    }
    const normalized = role.toString().toLowerCase();
    if (normalized.includes('platform')) return UserRole.PlatformAdmin;
    if (normalized.includes('student') || normalized.includes('trainee')) return UserRole.Trainee;
    if (normalized.includes('teacher') || normalized.includes('instructor')) return UserRole.Instructor;
    if (normalized.includes('admin')) return UserRole.Admin;
    return null;
}

function buildRoleTheme(roleKey: RoleKey, theme: Theme): RoleTheme {
    const chipColor: ChipTone = roleKey === 'default' ? 'default' : getRoleChipConfig(roleKey).color;
    const accent = resolveToneColor(chipColor, theme);
    const isDark = theme.palette.mode === 'dark';
    const gradientStart = alpha(accent, isDark ? 0.35 : 0.18);
    const gradientMid = alpha(accent, isDark ? 0.25 : 0.1);
    return {
        chipColor,
        accent,
        gradient: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientMid} 55%, ${theme.palette.background.paper} 100%)`,
        surface: alpha(accent, isDark ? 0.25 : 0.08),
        border: alpha(accent, isDark ? 0.5 : 0.2),
    };
}

function resolveToneColor(tone: ChipTone, theme: Theme) {
    switch (tone) {
        case 'primary':
        case 'secondary':
        case 'success':
        case 'info':
        case 'warning':
        case 'error':
            return theme.palette[tone].main;
        default:
            return theme.palette.text.primary;
    }
}

function formatMetricKey(key: string) {
    return key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
        .trim();
}

function formatMetricValue(key: string, value: number) {
    if (Number.isNaN(value)) return '—';
    const percentLike = /(percent|rate|ratio|grade|score)/i;
    if (percentLike.test(key)) {
        return `${value.toFixed(2)}%`;
    }
    if (Math.abs(value) >= 1000) {
        return compactMetricNumber.format(value);
    }
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

function getChartPalette(accent: string, theme: Theme) {
    return [
        accent,
        theme.palette.text.secondary,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
    ];
}

function GuidancePanel({ activeRole }: { activeRole?: UserRole | null }) {
    return (
        <Stack spacing={4} sx={{ flexGrow: 1 }}>
            <Stack spacing={2}>
                <Typography variant="h5" fontWeight={700}>
                    Role responsibilities
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Every role inherits the abilities of the one beneath it. Reference these callouts when you
                    distribute access or help a teammate understand why a module is read-only for them.
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap">
                    {roleGuidance.map((roleCard) => {
                        const isActive = activeRole === roleCard.role;
                        return (
                            <Paper
                                key={roleCard.title}
                                elevation={0}
                                sx={(theme) => ({
                                    flex: 1,
                                    minWidth: 240,
                                    p: 3,
                                    borderRadius: 4,
                                    border: `1px solid ${isActive ? alpha(theme.palette.primary.main, 0.45) : theme.palette.divider}`,
                                    backgroundColor: isActive
                                        ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.05)
                                        : theme.palette.background.paper,
                                })}
                            >
                                <Stack spacing={1.5}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <RoleChip role={roleCard.role} />
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            {roleCard.title}
                                        </Typography>
                                        {isActive ? (
                                            <Typography variant="caption" color="primary" fontWeight={700}>
                                                You are here
                                            </Typography>
                                        ) : null}
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        {roleCard.summary}
                                    </Typography>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                        {roleCard.actions.map((action) => (
                                            <li key={action}>
                                                <Typography variant="body2">{action}</Typography>
                                            </li>
                                        ))}
                                    </ul>
                                </Stack>
                            </Paper>
                        );
                    })}
                </Stack>
            </Stack>
            <ViewRolesMatrix activeRole={activeRole} />
        </Stack>
    );
}

function ViewRolesMatrix({ activeRole }: { activeRole?: UserRole | null }) {
    const [open, setOpen] = React.useState(false);
    const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
    const matrixRoles: UserRole[] = React.useMemo(
        () => [UserRole.Admin, UserRole.Instructor, UserRole.Trainee],
        []
    );


    interface AccessModeMeta {
        label: string;
        color: ChipProps['color'];
        variant: ChipProps['variant'];
        Icon: React.ElementType;
    }

    const accessModeMetaMap: Record<AccessMode, AccessModeMeta> = {
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

    function getAccessModeMeta(mode: AccessMode): AccessModeMeta {
        return accessModeMetaMap[mode] ?? accessModeMetaMap.none;
    }
    return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, display: 'flex', flexDirection: 'column' }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
            >
                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        View roles matrix
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Compare which dashboard areas each role can operate and expand rows for contextual notes.
                    </Typography>
                </Box>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setOpen((prev) => !prev)}
                    startIcon={open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                >
                    {open ? 'Hide matrix' : 'View roles'}
                </Button>
            </Stack>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 2 }}>
                    <TableContainer sx={{ maxHeight: 420 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>View</TableCell>
                                    {matrixRoles.map((role) => (
                                        <TableCell key={`matrix-head-${role}`} align="center" sx={{ fontWeight: 700 }}>
                                            {getRoleChipConfig(role).label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {viewGuidance.map((view) => {
                                    const isExpanded = expandedRow === view.title;
                                    return (
                                        <React.Fragment key={view.title}>
                                            <TableRow hover>
                                                <TableCell sx={{ width: '35%' }}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography fontWeight={600}>{view.title}</Typography>
                                                        <Tooltip title={isExpanded ? 'Hide details' : 'Show details'}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    setExpandedRow((prev) =>
                                                                        prev === view.title ? null : view.title
                                                                    );
                                                                }}
                                                            >
                                                                <InfoOutlinedIcon
                                                                    fontSize="small"
                                                                    color={isExpanded ? 'primary' : 'action'}
                                                                />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                                {matrixRoles.map((role) => {
                                                    const capability = view.capabilities.find(
                                                        (entry) => entry.role === role
                                                    );
                                                    const modeMeta = getAccessModeMeta(capability?.mode ?? 'none');
                                                    const IconComponent = modeMeta.Icon;
                                                    return (
                                                        <TableCell
                                                            key={`${view.title}-${role}`}
                                                            align="center"
                                                            sx={(theme) => ({
                                                                minWidth: 160,
                                                                backgroundColor:
                                                                    activeRole === role
                                                                        ? alpha(
                                                                            theme.palette.primary.main,
                                                                            theme.palette.mode === 'dark' ? 0.2 : 0.08
                                                                        )
                                                                        : undefined,
                                                            })}
                                                        >
                                                            <Stack spacing={0.75} alignItems="center">
                                                                <Chip
                                                                    size="medium"
                                                                    icon={<IconComponent />}
                                                                    label={modeMeta.label}
                                                                    color={modeMeta.color}
                                                                    variant={modeMeta.variant}
                                                                    sx={{ fontWeight: 600, px: 2, maxWidth: 220 }}
                                                                />
                                                            </Stack>
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={matrixRoles.length + 1} sx={{ py: 0, borderBottom: 0 }}>
                                                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                        <Box sx={{ py: 1.5 }}>
                                                            <Typography variant="subtitle2" gutterBottom>
                                                                Details
                                                            </Typography>
                                                            <Stack spacing={1.25}>
                                                                {view.capabilities.map((capability) => {
                                                                    const modeMeta = getAccessModeMeta(capability.mode);
                                                                    const IconComponent = modeMeta.Icon;
                                                                    return (
                                                                        <Stack
                                                                            key={`${view.title}-${capability.role}-detail`}
                                                                            spacing={0.5}
                                                                        >
                                                                            <Stack
                                                                                direction="row"
                                                                                spacing={1}
                                                                                alignItems="center"
                                                                                flexWrap="wrap"
                                                                            >
                                                                                <RoleChip role={capability.role} />
                                                                                <Chip
                                                                                    size="small"
                                                                                    icon={<IconComponent />}
                                                                                    label={modeMeta.label}
                                                                                    color={modeMeta.color}
                                                                                    variant={modeMeta.variant}
                                                                                    sx={{ fontWeight: 600 }}
                                                                                />
                                                                                <Typography variant="body2" fontWeight={600}>
                                                                                    {capability.capability}
                                                                                </Typography>
                                                                            </Stack>
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                {capability.detail}
                                                                            </Typography>
                                                                        </Stack>
                                                                    );
                                                                })}
                                                            </Stack>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Collapse>
        </Paper>
    );
}
function RocketBackdrop({ pointer }: { pointer: Pointer }) {
    return (
        <Box
            aria-hidden
            sx={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
                zIndex: 0,
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    inset: '-20%',
                    filter: 'blur(60px)',
                    opacity: 0.35,
                    backgroundImage:
                        'radial-gradient(circle at 20% 20%, rgba(79,70,229,0.45), transparent 55%), radial-gradient(circle at 80% 0%, rgba(14,165,233,0.35), transparent 60%)',
                    backgroundRepeat: 'no-repeat',
                    transform: 'rotate(-8deg)',
                }}
            />
            <MotionBox
                sx={{
                    position: 'absolute',
                    width: '65vw',
                    height: '65vw',
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 45%, transparent 70%)',
                    filter: 'blur(120px)',
                    opacity: 0.45,
                }}
                animate={{
                    x: pointer.x * 120,
                    y: pointer.y * 80,
                }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            />
            {rocketPositions.map((rocket) => (
                <motion.img
                    key={rocket.id}
                    src="/assets/absolute-rocket.webp"
                    alt=""
                    aria-hidden
                    style={{
                        position: 'absolute',
                        width: 16,
                        opacity: 0.05 + rocket.depth * 0.08,
                        top: `${rocket.top}%`,
                        left: `${rocket.left}%`,
                        filter: 'blur(1px)',
                    }}
                    animate={{
                        x: pointer.x * rocket.depth * 18,
                        y: pointer.y * rocket.depth * 18,
                        rotate: pointer.x * 2,
                    }}
                    transition={{ type: 'spring', stiffness: 140, damping: 16 }}
                />
            ))}
        </Box>
    );
}
