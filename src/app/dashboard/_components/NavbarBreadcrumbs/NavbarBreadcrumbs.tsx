'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Typography from '@mui/material/Typography';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { BREADCRUMB_ARIA_LABEL } from './constants';
import { formatBreadcrumbLabel, getBreadcrumbHref } from './utils';
import { StyledBreadcrumbs } from './elements';

function NavbarBreadcrumbsContent() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !pathname) {
    return null;
  }

  const pathParts = pathname.split('/').filter(Boolean);

  return (
    <StyledBreadcrumbs
      aria-label={BREADCRUMB_ARIA_LABEL}
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {pathParts.map((part, index) => {
        const href = getBreadcrumbHref(pathParts, index);
        const isLast = index === pathParts.length - 1;
        const displayName = formatBreadcrumbLabel(part);

        return (
          <Link key={index} href={href as any} style={{ textDecoration: 'none' }}>
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
}

export default dynamic(() => Promise.resolve(NavbarBreadcrumbsContent), {
  ssr: false,
});
