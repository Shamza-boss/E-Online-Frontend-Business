import * as React from 'react';
import TimelineIcon from '@mui/icons-material/Timeline';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { type UserRole } from '@/app/_lib/Enums/UserRole';
import {
  PLATFORM_OWNER_ROLE,
  PLATFORM_ONLY_ROUTES,
  FULL_ACCESS_ROLES,
  STUDENT_ALLOWED_ROUTES,
  SETTINGS_ROUTE,
} from './constants';

export const ROUTE_ICONS: Record<string, React.ReactNode> = {
  '': <TimelineIcon />,
  institutions: <DomainAddIcon />,
  billing: <CreditCardIcon />,
  management: <ManageAccountsIcon />,
  'manage-courses': <AssignmentIcon />,
  courses: <SchoolIcon />,
  library: <LocalLibraryIcon />,
  settings: <SettingsRoundedIcon />,
};

export function getCurrentActiveRoute(pathname: string): string {
  return pathname.replace('/dashboard/', '').split('/')[0] || '';
}

export function hasRouteAccess(role: UserRole, route: string): boolean {
  const isPlatformOnly = PLATFORM_ONLY_ROUTES.includes(route as (typeof PLATFORM_ONLY_ROUTES)[number]);
  const hasFullAccess = FULL_ACCESS_ROLES.includes(role);
  const isSettingsRoute = route === SETTINGS_ROUTE;
  const blockedForPlatformOwner =
    role === PLATFORM_OWNER_ROLE && (route === 'courses' || route === 'library');

  return (
    isSettingsRoute ||
    (isPlatformOnly && role === PLATFORM_OWNER_ROLE) ||
    (!isPlatformOnly &&
      !blockedForPlatformOwner &&
      (hasFullAccess || STUDENT_ALLOWED_ROUTES.includes(route as (typeof STUDENT_ALLOWED_ROUTES)[number])))
  );
}
