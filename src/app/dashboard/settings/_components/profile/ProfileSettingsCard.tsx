'use client';

import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Theme, alpha } from '@mui/material/styles';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { updateProfileAction } from '../../actions';

export interface ProfileSettingsUser {
    userId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string | null;
    institutionName: string | null;
}

interface ProfileSettingsCardProps {
    user: ProfileSettingsUser;
}

const cardBg = (theme: Theme) =>
    `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${theme.palette.background.paper} 60%)`;

function buildInitials(firstName?: string | null, lastName?: string | null, email?: string) {
    const parts = [firstName, lastName]
        .filter((part): part is string => Boolean(part))
        .map((part) => part.trim().charAt(0).toUpperCase());
    if (parts.length > 0) {
        return parts.join('');
    }
    return email?.charAt(0).toUpperCase() ?? '?';
}

export function formatRoleLabel(role: string) {
    const humanized = role
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/_/g, ' ')
        .toLowerCase();
    return humanized.replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ProfileSettingsCard({ user }: ProfileSettingsCardProps) {
    const { showAlert } = useAlert();
    const initialFirstName = (user.firstName ?? '').trim();
    const initialLastName = (user.lastName ?? '').trim();
    const [firstName, setFirstName] = React.useState(initialFirstName);
    const [lastName, setLastName] = React.useState(initialLastName);
    const [savedNames, setSavedNames] = React.useState({
        first: initialFirstName,
        last: initialLastName,
    });
    const [isPending, startTransition] = React.useTransition();

    React.useEffect(() => {
        const normalizedFirst = (user.firstName ?? '').trim();
        const normalizedLast = (user.lastName ?? '').trim();
        setFirstName(normalizedFirst);
        setLastName(normalizedLast);
        setSavedNames({ first: normalizedFirst, last: normalizedLast });
    }, [user.firstName, user.lastName]);

    const hasChanges = firstName.trim() !== savedNames.first || lastName.trim() !== savedNames.last;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const normalizedFirst = firstName.trim();
        const normalizedLast = lastName.trim();

        if (!normalizedFirst || !normalizedLast) {
            showAlert('warning', 'Please fill in both your first and last name.');
            return;
        }

        startTransition(async () => {
            try {
                const updated = await updateProfileAction({
                    firstName: normalizedFirst,
                    lastName: normalizedLast,
                });
                setSavedNames({ first: updated.firstName, last: updated.lastName });
                setFirstName(updated.firstName);
                setLastName(updated.lastName);
                showAlert('success', 'Your profile was updated successfully.');
            } catch (error: unknown) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'We could not update your profile right now.';
                showAlert('error', message);
            }
        });
    };

    const handleReset = () => {
        setFirstName(savedNames.first);
        setLastName(savedNames.last);
    };

    return (
        <Card
            elevation={10}
            sx={(theme) => ({
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                backgroundImage: cardBg(theme),
                boxShadow: '0 30px 70px rgba(15, 23, 42, 0.18)',
                backdropFilter: 'blur(14px)',
            })}
        >
            <CardContent>
                <Stack spacing={4}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
                        <Avatar
                            sx={(theme) => ({
                                bgcolor: alpha(theme.palette.primary.main, 0.18),
                                color: theme.palette.primary.dark,
                                width: 72,
                                height: 72,
                                fontSize: 28,
                                fontWeight: 600,
                                border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                            })}
                        >
                            {buildInitials(savedNames.first, savedNames.last, user.email)}
                        </Avatar>
                        <Box textAlign={{ xs: 'center', sm: 'left' }}>
                            <Typography variant="h5" fontWeight={600} gutterBottom>
                                {[savedNames.first, savedNames.last].filter(Boolean).join(' ') || 'Your profile'}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Keep your display name up to date so classmates and colleagues recognize you.
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <DetailBlock label="Email" value={user.email || 'Unavailable'} />
                        <DetailBlock label="Role" value={user.role ? formatRoleLabel(user.role) : 'Not assigned'} />
                        <DetailBlock
                            label="Institution"
                            value={user.institutionName ?? 'Not linked yet'}
                        />
                    </Stack>

                    <Alert severity="info" sx={{ borderRadius: 3 }}>
                        Profile deletion and email changes are disabled to prevent accidentally locking yourself out.
                    </Alert>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={3}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                <TextField
                                    label="First name"
                                    fullWidth
                                    value={firstName}
                                    onChange={(event) => setFirstName(event.target.value)}
                                    disabled={isPending}
                                    autoComplete="given-name"
                                />
                                <TextField
                                    label="Last name"
                                    fullWidth
                                    value={lastName}
                                    onChange={(event) => setLastName(event.target.value)}
                                    disabled={isPending}
                                    autoComplete="family-name"
                                />
                            </Stack>
                            <TextField
                                label="Email"
                                fullWidth
                                value={user.email}
                                disabled
                                helperText="Your email address is protected. Contact an admin if it needs to change."
                            />
                        </Stack>
                        <Divider sx={{ my: 4 }} />
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
                            <Button
                                type="button"
                                variant="text"
                                onClick={handleReset}
                                disabled={isPending || !hasChanges}
                            >
                                Reset
                            </Button>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isPending}
                                disabled={!hasChanges}
                                sx={{ px: 4 }}
                            >
                                Save changes
                            </LoadingButton>
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

interface DetailBlockProps {
    label: string;
    value: string;
}

function DetailBlock({ label, value }: DetailBlockProps) {
    return (
        <Box
            sx={(theme) => ({
                flex: 1,
                borderRadius: 3,
                border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                padding: 2,
                minHeight: 92,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
            })}
        >
            <Typography variant="caption" textTransform="uppercase" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                {value}
            </Typography>
        </Box>
    );
}
