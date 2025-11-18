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
import TimelineIcon from '@mui/icons-material/Timeline';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { routeLabels } from '@/app/_lib/common/functions';
import { UserRole } from '@/app/_lib/Enums/UserRole';

const platformOwnerRole = UserRole.PlatformAdmin;

const platformOnlyRoutes = ['institutions'];

// numeric roles with full access (Admin, Trainer(Teacher))
const fullAccessRoles: UserRole[] = [UserRole.Admin, UserRole.Instructor];
// student allowed routes
const studentAllowed = ['', 'courses', 'library'];

const mainListItems = [
  { route: '', icon: <TimelineIcon /> }, // Dashboard root route
  { route: 'institutions', icon: <DomainAddIcon /> }, // Institutions route
  { route: 'management', icon: <ManageAccountsIcon /> },
  { route: 'manage-courses', icon: <AssignmentIcon /> },
  { route: 'courses', icon: <SchoolIcon /> },
  { route: 'library', icon: <LocalLibraryIcon /> },
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

  const handleRouteClick = (route: string) => {
    setClickedRoute(route);
    startTransition(() => {
      router.push(`/dashboard/${route}` as any);
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

    // Check if user has access to this route
    const hasAccess =
      (isPlatformOnly && roleValue === platformOwnerRole) ||
      (!isPlatformOnly && (hasFullAccess || studentAllowed.includes(route))) &&
      !(route === 'courses' && roleValue === platformOwnerRole);

    // Only render if user has access
    if (!hasAccess) {
      return null;
    }

    return (
      <ListItem
        key={index}
        disablePadding
        sx={{
          display: 'block',
          mb: 0.3,
          '&:last-child': { mb: 0 },
        }}
      >
        <ListItemButton
          onClick={() => handleRouteClick(route)}
          title={label}
          aria-label={label}
          selected={isActive || isLoading}
          sx={{
            borderRadius: 1,
          }}
        >
          <ListItemIcon sx={{ minWidth: 32, mr: 1 }}>
            {isLoading ? <CircularProgress size={20} /> : item.icon}
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
