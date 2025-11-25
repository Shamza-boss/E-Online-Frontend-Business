'use client';

import React from 'react';
import {
    Box,
    Button,
    Collapse,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { RoleChip } from '@/app/_lib/components/role/roleChip';
import { getRoleChipConfig } from '@/app/_lib/common/functions';
import { UserRole } from '@/app/_lib/Enums/UserRole';

interface RoleGuidanceCard {
    title: string;
    role: UserRole;
    summary: string;
    actions: string[];
}

interface GuidancePanelProps {
    activeRole?: UserRole | null;
}

interface ViewExpectation {
    role: UserRole;
    detail: string;
    hasAccess: boolean;
}

interface ViewGuidanceEntry {
    title: string;
    description: string;
    expectations: ViewExpectation[];
}

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

const viewGuidance: ViewGuidanceEntry[] = [
    {
        title: 'Dashboard Overview',
        description:
            'Surface-level pulse cards, upcoming sessions, and reminders. Everyone lands here after sign in.',
        expectations: [
            { role: UserRole.Admin, detail: 'Double-check attendance trends and revenue snapshots.', hasAccess: true },
            { role: UserRole.Instructor, detail: 'Review workload, outstanding grading, and live class cards.', hasAccess: true },
            { role: UserRole.Trainee, detail: 'Track upcoming homework, exams, and study streaks.', hasAccess: true },
        ],
    },
    {
        title: 'Management Suite',
        description:
            'Full CRUD workspace for institutions, classrooms, academics, and people records.',
        expectations: [
            { role: UserRole.Admin, detail: 'Primary operator—create courses, institutions, and onboard staff.', hasAccess: true },
            { role: UserRole.Instructor, detail: 'View-only access to verify rosters they teach.', hasAccess: true },
            { role: UserRole.Trainee, detail: 'No access—protects students from accidental edits.', hasAccess: false },
        ],
    },
    {
        title: 'Library & Notes',
        description:
            'Centralized storage for PDF packs, math builders, and collaborative notes.',
        expectations: [
            { role: UserRole.Admin, detail: 'Upload institution branded packs and approve shared libraries.', hasAccess: true },
            { role: UserRole.Instructor, detail: 'Publish lessons, video summaries, and attach references.', hasAccess: true },
            { role: UserRole.Trainee, detail: 'Consume resources and attach personal annotations for revision.', hasAccess: true },
        ],
    },
    {
        title: 'Assignments & Streams',
        description:
            'Homework distribution, grading, streaming, and attendance is coordinated here.',
        expectations: [
            { role: UserRole.Admin, detail: 'Monitor compliance and escalate missing grading cycles.', hasAccess: true },
            { role: UserRole.Instructor, detail: 'Create assignments, schedule live streams, grade submissions.', hasAccess: true },
            { role: UserRole.Trainee, detail: 'Upload submissions, join streams, and view evaluation feedback.', hasAccess: true },
        ],
    },
];

export default function GuidancePanel({ activeRole }: GuidancePanelProps) {
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

function ViewRolesMatrix({ activeRole }: GuidancePanelProps) {
    const [open, setOpen] = React.useState(true);
    const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
    const matrixRoles = React.useMemo(() => [UserRole.Admin, UserRole.Instructor, UserRole.Trainee], []);

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
                                            {getRoleLabel(role)}
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
                                                    const expectation = view.expectations.find((entry) => entry.role === role);
                                                    const hasAccess = expectation?.hasAccess ?? false;
                                                    return (
                                                        <TableCell
                                                            key={`${view.title}-${role}`}
                                                            align="center"
                                                            sx={(theme) => ({
                                                                minWidth: 120,
                                                                backgroundColor:
                                                                    activeRole === role
                                                                        ? alpha(
                                                                            theme.palette.primary.main,
                                                                            theme.palette.mode === 'dark' ? 0.2 : 0.08
                                                                        )
                                                                        : undefined,
                                                            })}
                                                        >
                                                            {hasAccess ? (
                                                                <CheckCircleOutlineIcon fontSize="small" color="success" />
                                                            ) : (
                                                                <HighlightOffIcon
                                                                    fontSize="small"
                                                                    color="error"
                                                                    sx={{ opacity: 0.8 }}
                                                                />
                                                            )}
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
                                                                {view.expectations.map((expectation) => (
                                                                    <Stack
                                                                        key={`${view.title}-${expectation.role}-detail`}
                                                                        direction="row"
                                                                        spacing={1}
                                                                        alignItems="center"
                                                                    >
                                                                        <RoleChip role={expectation.role} />
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            {expectation.detail}
                                                                        </Typography>
                                                                    </Stack>
                                                                ))}
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

function getRoleLabel(role: UserRole) {
    return getRoleChipConfig(role).label;
}
