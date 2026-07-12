'use client';

import React from 'react';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { RoleChip } from '@/app/_lib/components/role/roleChip';
import { getRoleChipConfig } from '@/app/_lib/common/functions';
import { type UserRole } from '@/app/_lib/Enums/UserRole';
import { ROLE_GUIDANCE, VIEW_GUIDANCE, MATRIX_ROLES } from '../constants';
import { getAccessModeMeta } from '../utils';

type RoleGuidancePanelProps = {
  activeRole?: UserRole | null;
}

export default function RoleGuidancePanel({ activeRole }: RoleGuidancePanelProps) {
  return (
    <Stack spacing={3} sx={{ width: '100%', minWidth: 0 }}>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Role responsibilities
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Every role inherits the abilities of the one beneath it. Reference these callouts when you
          distribute access or help a teammate understand why a module is read-only for them.
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} flexWrap="wrap">
          {ROLE_GUIDANCE.map((roleCard) => {
            const isActive = activeRole === roleCard.role;
            return (
              <Paper
                key={roleCard.title}
                elevation={0}
                variant="outlined"
                sx={(theme) => ({
                  flex: { md: '1 1 240px' },
                  width: { xs: '100%', md: 'auto' },
                  minWidth: { md: 240 },
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  borderColor: isActive ? alpha(theme.palette.primary.main, 0.45) : theme.palette.divider,
                  backgroundColor: isActive
                    ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.05)
                    : theme.palette.background.paper,
                })}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <RoleChip role={roleCard.role} />
                    <Typography variant="subtitle2" fontWeight={700}>
                      {roleCard.title}
                    </Typography>
                    {isActive ? (
                      <Typography variant="caption" color="primary" fontWeight={700}>
                        You are here
                      </Typography>
                    ) : null}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {roleCard.summary}
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {roleCard.actions.map((action) => (
                      <li key={action}>
                        <Typography variant="body2">{action}</Typography>
                      </li>
                    ))}
                  </ul>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Stack>
      <ViewRolesMatrix activeRole={activeRole} />
    </Stack>
  );
}

function ViewRolesMatrix({ activeRole }: { activeRole?: UserRole | null }) {
  const [open, setOpen] = React.useState(false);
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            View roles matrix
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Compare which dashboard areas each role can operate and expand rows for contextual notes.
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setOpen((prev) => !prev)}
          startIcon={
            open ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )
          }
        >
          {open ? 'Hide matrix' : 'View roles'}
        </Button>
      </Stack>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2 }}>
          <TableContainer sx={{ maxHeight: 420 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>View</TableCell>
                  {MATRIX_ROLES.map((role) => (
                    <TableCell key={`matrix-head-${role}`} align="center" sx={{ fontWeight: 700 }}>
                      {getRoleChipConfig(role).label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {VIEW_GUIDANCE.map((view) => {
                  const isExpanded = expandedRow === view.title;
                  return (
                    <React.Fragment key={view.title}>
                      <TableRow hover>
                        <TableCell sx={{ width: '35%' }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography fontWeight={600}>{view.title}</Typography>
                            <Tooltip title={isExpanded ? 'Hide details' : 'Show details'}>
                              <IconButton
                                size="small"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setExpandedRow((prev) =>
                                    prev === view.title ? null : view.title,
                                  );
                                }}
                              >
                                <InfoOutlinedIcon
                                  fontSize="small"
                                  color={isExpanded ? 'primary' : 'action'}
                                />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                        {MATRIX_ROLES.map((role) => {
                          const capability = view.capabilities.find(
                            (entry) => entry.role === role,
                          );
                          const modeMeta = getAccessModeMeta(capability?.mode ?? 'none');
                          const IconComponent = modeMeta.Icon;
                          return (
                            <TableCell
                              key={`${view.title}-${role}`}
                              align="center"
                              sx={(theme) => ({
                                minWidth: 160,
                                backgroundColor:
                                  activeRole === role
                                    ? alpha(
                                        theme.palette.primary.main,
                                        theme.palette.mode === 'dark' ? 0.2 : 0.08,
                                      )
                                    : undefined,
                              })}
                            >
                              <Stack spacing={0.75} alignItems="center">
                                <Chip
                                  size="medium"
                                  icon={<IconComponent />}
                                  label={modeMeta.label}
                                  color={modeMeta.color}
                                  variant={modeMeta.variant}
                                  sx={{ fontWeight: 600, px: 2, maxWidth: 220 }}
                                />
                              </Stack>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={MATRIX_ROLES.length + 1} sx={{ py: 0, borderBottom: 0 }}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ py: 1.5 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Details
                              </Typography>
                              <Stack spacing={1.25}>
                                {view.capabilities.map((capability) => {
                                  const modeMeta = getAccessModeMeta(capability.mode);
                                  const IconComponent = modeMeta.Icon;
                                  return (
                                    <Stack
                                      key={`${view.title}-${capability.role}-detail`}
                                      spacing={0.5}
                                    >
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        flexWrap="wrap"
                                      >
                                        <RoleChip role={capability.role} />
                                        <Chip
                                          size="small"
                                          icon={<IconComponent />}
                                          label={modeMeta.label}
                                          color={modeMeta.color}
                                          variant={modeMeta.variant}
                                          sx={{ fontWeight: 600 }}
                                        />
                                        <Typography variant="body2" fontWeight={600}>
                                          {capability.capability}
                                        </Typography>
                                      </Stack>
                                      <Typography variant="body2" color="text.secondary">
                                        {capability.detail}
                                      </Typography>
                                    </Stack>
                                  );
                                })}
                              </Stack>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Collapse>
    </Paper>
  );
}
