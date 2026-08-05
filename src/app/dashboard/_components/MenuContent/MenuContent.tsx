'use client';

import * as React from 'react';
import { useEffect, useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import { routeLabels } from '@/app/_lib/common/functions';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { normalizeRole } from '../MainGrid/utils';
import { MAIN_ROUTES, SECONDARY_ROUTES } from './constants';
import { ROUTE_ICONS, getCurrentActiveRoute, hasRouteAccess } from './utils';
import { MenuStack, ListItemWrapper, NavListItemButton } from './elements';

type MenuItemConfig = {
  route: string;
  text?: string;
};

export default function MenuContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [clickedRoute, setClickedRoute] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setClickedRoute(null);
  }, [pathname]);

  if (status === 'loading') {
    return null;
  }

  const roleValue = normalizeRole(session?.user?.role) ?? UserRole.Trainee;
  const currentActiveRoute = getCurrentActiveRoute(pathname);

  const handleRouteClick = (route: string) => {
    setClickedRoute(route);
    startTransition(() => {
      router.push(`/dashboard/${route}` as any);
    });
  };

  const renderListItem = (item: MenuItemConfig, index: number) => {
    const { route } = item;
    const label = item.text || routeLabels[route] || route;
    const isActive = currentActiveRoute === route;
    const isLoading = isPending && clickedRoute === route;
    // Only one pill at a time — during navigation highlight the destination, not both.
    const isSelected = isPending ? clickedRoute === route : isActive;

    if (!hasRouteAccess(roleValue, route)) {
      return null;
    }

    return (
      <ListItem key={`${route}-${index}`} disablePadding sx={{ display: 'block' }}>
        <ListItemWrapper>
          <NavListItemButton
            onClick={() => handleRouteClick(route)}
            title={label}
            aria-label={label}
            selected={isSelected}
          >
            <ListItemIcon sx={{ minWidth: 32, mr: 1 }}>
              {isLoading ? <CircularProgress size={20} /> : ROUTE_ICONS[route]}
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
          </NavListItemButton>
        </ListItemWrapper>
      </ListItem>
    );
  };

  return (
    <MenuStack>
      <List dense>
        {MAIN_ROUTES.map((route, index) => renderListItem({ route }, index))}
      </List>

      <List dense>
        {SECONDARY_ROUTES.map((item, index) => renderListItem(item, index))}
      </List>
    </MenuStack>
  );
}
