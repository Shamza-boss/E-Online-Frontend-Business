'use client';

import { Button, IconButton, Stack, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
        ? 'Only administrators and moderators can make changes on this page. Please contact your administrator for assistance.'
        : '';

    return (
        <Stack spacing={2} direction="row">
            {activeTab === '2' && (
                <>
                    <Tooltip title={noPermissionTooltip}>
                        <span>
                            <Button
                                sx={{ maxWidth: 'max-content' }}
                                variant="outlined"
                                onClick={onOpenClassCreator}
                                disabled={!isElevated}
                            >
                                Create course
                            </Button>
                        </span>
                    </Tooltip>
                    <Button
                        sx={{ maxWidth: 'max-content' }}
                        variant="outlined"
                        onClick={onOpenSubjectCreator}
                        disabled={!isElevated}
                    >
                        Create subjects
                    </Button>
                    <Button
                        sx={{ maxWidth: 'max-content' }}
                        variant="outlined"
                        onClick={onOpenAcademicsCreator}
                        disabled={!isElevated}
                    >
                        Create academic levels
                    </Button>
                </>
            )}
            {activeTab === '1' && (
                <>
                    <Tooltip title={noPermissionTooltip}>
                        <span>
                            <Button
                                sx={{ maxWidth: 'max-content' }}
                                variant="outlined"
                                onClick={onOpenRegisterPerson}
                                disabled={!isElevated}
                            >
                                Register person
                            </Button>
                        </span>
                    </Tooltip>
                    <Tooltip title="Use the trash icon in the table actions to remove a person. A confirmation dialog will appear before deletion.">
                        <IconButton
                            size="small"
                            sx={{ alignSelf: 'center' }}
                            aria-label="People management help"
                        >
                            <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </>
            )}
        </Stack>
    );
}
