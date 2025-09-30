'use client';
import * as React from 'react';
import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import TimelineIcon from '@mui/icons-material/Timeline';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import LockIcon from '@mui/icons-material/Lock';
import { routeLabels } from '@/app/_lib/common/functions';
import { UserRole } from '@/app/_lib/Enums/UserRole';

const platformOwnerRole = UserRole.PlatformAdmin;

const platformOnlyRoutes = ['institutions'];

// numeric roles with full access (Admin, Trainer(Teacher), Moderator)
const fullAccessRoles: UserRole[] = [
  UserRole.Admin,
  UserRole.Teacher,
  UserRole.Moderator,
];
// student allowed routes
const studentAllowed = ['', 'classes'];

const mainListItems = [
  { route: '', icon: <TimelineIcon /> }, // Dashboard root route
  { route: 'institutions', icon: <DomainAddIcon /> }, // Institutions route
  { route: 'management', icon: <ManageAccountsIcon /> },
  { route: 'manage-classes', icon: <AssignmentIcon /> },
  { route: 'classes', icon: <SchoolIcon /> },
];

const secondaryListItems = [
  { text: 'Settings', route: 'settings', icon: <SettingsRoundedIcon /> },
];

export default function MenuContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [clickedRoute, setClickedRoute] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // While session is loading, show nothing or a skeleton
  if (status === 'loading') return null;

  // session.user.role is a string, parse to numeric UserRole
  const rawRole = session?.user?.role;
  const roleValue: UserRole =
    typeof rawRole === 'string'
      ? (parseInt(rawRole, 10) as UserRole)
      : (rawRole as UserRole);

  const currentActiveRoute =
    pathname.replace('/dashboard/', '').split('/')[0] || '';

  const handleRouteClick = (route: string, disabled: boolean) => {
    if (disabled) return;
    setClickedRoute(route);
    startTransition(() => {
      router.push(`/dashboard/${route}`);
    });
  };

  const renderListItem = (
    item: { route: string; icon: React.ReactNode; text?: string },
    index: number
  ) => {
    const route = item.route;
    const label = item.text || routeLabels[route] || route;
    const isActive = currentActiveRoute === route;
    const isLoading = isPending && clickedRoute === route;
    const isPlatformOnly = platformOnlyRoutes.includes(route);
    const hasFullAccess = fullAccessRoles.includes(roleValue);

    const disabled =
      (isPlatformOnly && roleValue !== platformOwnerRole) ||
      (!isPlatformOnly && !hasFullAccess && !studentAllowed.includes(route)) ||
      (route === 'classes' && roleValue === platformOwnerRole);

    // ❗️If route is platform-only and user isn't platform owner, skip rendering
    if (isPlatformOnly && roleValue !== platformOwnerRole) {
      return null;
    }

    return (
      <ListItem
        key={index}
        disablePadding
        sx={{
          display: 'block',
          mb: disabled ? 0.5 : 0.3,
          '&:last-child': { mb: 0 },
        }}
      >
        <Tooltip title={disabled ? 'Access locked' : ''} placement="right">
          <span>
            <ListItemButton
              onClick={() => handleRouteClick(route, disabled)}
              title={label}
              aria-label={label}
              selected={isActive || isLoading}
              disabled={disabled}
              sx={{
                borderRadius: 1,
                '&.Mui-disabled': { opacity: 0.5, cursor: 'default' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, mr: 1 }}>
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : disabled ? (
                  <LockIcon />
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText
                primary={label}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'left',
                }}
              />
            </ListItemButton>
          </span>
        </Tooltip>
      </ListItem>
    );
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => renderListItem(item, index))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) =>
          renderListItem(
            { route: item.route, icon: item.icon, text: item.text },
            index
          )
        )}
      </List>
    </Stack>
  );
}
