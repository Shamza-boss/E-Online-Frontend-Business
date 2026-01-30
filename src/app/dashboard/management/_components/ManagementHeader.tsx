'use client';

import { Button, Stack, Tooltip, Typography, Box } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SchoolIcon from '@mui/icons-material/School';

interface ManagementHeaderProps {
    activeTab: string;
    isElevated: boolean;
    onOpenRegisterPerson: () => void;
    onOpenClassCreator: () => void;
    onOpenSubjectCreator: () => void;
    onOpenAcademicsCreator: () => void;
}

export default function ManagementHeader({
    activeTab,
    isElevated,
    onOpenRegisterPerson,
    onOpenClassCreator,
    onOpenSubjectCreator,
    onOpenAcademicsCreator,
}: ManagementHeaderProps) {
    const noPermissionTooltip = !isElevated
        ? 'Only administrators can make changes on this page. Please contact your administrator for assistance.'
        : '';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Stack spacing={2} direction="row" alignItems="center">
                {activeTab === '2' && (
                    <>
                        <Tooltip title={isElevated ? 'Add a new course to your institution' : noPermissionTooltip}>
                            <span>
                                <Button
                                    sx={{ maxWidth: 'max-content' }}
                                    variant="contained"
                                    startIcon={<SchoolIcon />}
                                    onClick={onOpenClassCreator}
                                    disabled={!isElevated}
                                >
                                    New Course
                                </Button>
                            </span>
                        </Tooltip>
                        <Tooltip title={isElevated ? 'Add a new subject that courses can be linked to' : noPermissionTooltip}>
                            <span>
                                <Button
                                    sx={{ maxWidth: 'max-content' }}
                                    variant="outlined"
                                    onClick={onOpenSubjectCreator}
                                    disabled={!isElevated}
                                >
                                    Add Subject
                                </Button>
                            </span>
                        </Tooltip>
                        <Tooltip title={isElevated ? 'Add a new academic level (e.g., Grade 10, Year 1)' : noPermissionTooltip}>
                            <span>
                                <Button
                                    sx={{ maxWidth: 'max-content' }}
                                    variant="outlined"
                                    onClick={onOpenAcademicsCreator}
                                    disabled={!isElevated}
                                >
                                    Add Academic Level
                                </Button>
                            </span>
                        </Tooltip>
                    </>
                )}
                {activeTab === '1' && (
                    <>
                        <Tooltip title={isElevated ? 'Invite a new user (student, instructor, or admin) to your institution' : noPermissionTooltip}>
                            <span>
                                <Button
                                    sx={{ maxWidth: 'max-content' }}
                                    variant="contained"
                                    startIcon={<PersonAddIcon />}
                                    onClick={onOpenRegisterPerson}
                                    disabled={!isElevated}
                                >
                                    Add New User
                                </Button>
                            </span>
                        </Tooltip>
                    </>
                )}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 'fit-content' }}>
                {activeTab === '1' && (
                    <>Use the <strong>Actions</strong> column to edit or remove users. Click a row&apos;s edit icon to modify details inline.</>
                )}
                {activeTab === '2' && (
                    <>Manage your courses here. Use <strong>Actions</strong> to edit or delete. Click Subjects or Academic Levels using the buttons above.</>
                )}
            </Typography>
        </Box>
    );
}
