'use client';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { routeLabels } from '@/app/_lib/common/functions';

const NavbarBreadcrumbs = dynamic(
  () =>
    Promise.resolve(() => {
      const pathname = usePathname();
      const [isMounted, setIsMounted] = useState(false);

      useEffect(() => {
        setIsMounted(true);
      }, []);

      if (!isMounted || !pathname) return null;

      const pathParts = pathname.split('/').filter(Boolean);

      return (
        <StyledBreadcrumbs
          aria-label="breadcrumb"
          separator={<NavigateNextRoundedIcon fontSize="small" />}
        >
          {pathParts.map((part, index) => {
            const href = '/' + pathParts.slice(0, index + 1).join('/');
            const isLast = index === pathParts.length - 1;

            let displayName: string;

            if (routeLabels[part]) {
              displayName = routeLabels[part];
            } else if (part.includes('~')) {
              // Slug format: name~id
              const [namePart] = decodeURIComponent(part).split('~');
              displayName = namePart.replace(/-/g, ' ');
            } else {
              displayName = part
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase());
            }

            return (
              <Link key={index} href={href} style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: isLast ? 'primary.main' : 'text.primary',
                    fontWeight: 600,
                  }}
                >
                  {displayName}
                </Typography>
              </Link>
            );
          })}
        </StyledBreadcrumbs>
      );
    }),
  { ssr: false }
);

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default NavbarBreadcrumbs;
