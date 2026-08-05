import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import {
  dashboardPageRootSx,
  dashboardSectionSpacing,
} from '@/app/_lib/layout/dashboardPageLayout';
import type { RoleHomeShellProps } from './types';
import { BentoBoard, HeroMetric, HeroStrip, PageHeader } from './elements';

export default function RoleHomeShell({
  title,
  description,
  heroes = [],
  columns = 3,
  children,
}: RoleHomeShellProps) {
  return (
    <Box sx={{ ...dashboardPageRootSx, overflow: 'auto' }}>
      <Stack
        spacing={dashboardSectionSpacing}
        sx={{
          width: '100%',
          minWidth: 0,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PageHeader>
          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>
          {description ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 720, mt: 0.75 }}
            >
              {description}
            </Typography>
          ) : null}
        </PageHeader>

        {heroes.length > 0 ? (
          <HeroStrip>
            {heroes.map((hero) => (
              <HeroMetric
                key={hero.label}
                elevation={0}
                variant="outlined"
                onClick={hero.onOpen}
                role={hero.onOpen ? 'button' : undefined}
                tabIndex={hero.onOpen ? 0 : undefined}
                aria-label={
                  hero.onOpen ? `Open ${hero.label} details` : undefined
                }
                sx={
                  hero.onOpen
                    ? {
                        cursor: 'pointer',
                        position: 'relative',
                        '&:hover, &:focus-visible': {
                          borderColor: 'primary.main',
                        },
                      }
                    : undefined
                }
                onKeyDown={
                  hero.onOpen
                    ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          hero.onOpen?.();
                        }
                      }
                    : undefined
                }
              >
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    textTransform="uppercase"
                    letterSpacing={0.4}
                  >
                    {hero.label}
                  </Typography>
                  {hero.onOpen ? (
                    <Box
                      sx={{
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 16,
                        opacity: 0.7,
                        flexShrink: 0,
                      }}
                    >
                      <OpenInFullIcon fontSize="inherit" />
                    </Box>
                  ) : null}
                </Stack>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="primary.main"
                  sx={{ mt: 0.5, lineHeight: 1.1, letterSpacing: '-0.02em' }}
                >
                  {hero.value}
                </Typography>
                {hero.hint ? (
                  <Typography variant="caption" color="text.secondary">
                    {hero.hint}
                  </Typography>
                ) : null}
              </HeroMetric>
            ))}
          </HeroStrip>
        ) : null}

        <BentoBoard
          sx={{
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: `repeat(${columns}, minmax(0, 1fr))`,
            },
          }}
        >
          {children}
        </BentoBoard>
      </Stack>
    </Box>
  );
}
