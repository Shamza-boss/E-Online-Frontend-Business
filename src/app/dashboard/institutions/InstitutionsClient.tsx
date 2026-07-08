'use client';
import React, { useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import InstitutionUserDataGrid from './_components/InstitutionUserDataGrid';
import EnrollInstitutionModal from './_components/Modals/EnrollInstitutionModal';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { useSession } from 'next-auth/react';
import type { InstitutionWithAdminDto } from '@/app/_lib/interfaces/types';
import type { PagedResult } from '@/app/_lib/interfaces/pagination';
import { getDashboardPagePadding } from '@/app/_lib/layout/dashboardPageLayout';

export interface InstitutionsClientProps {
  initialInstitutionsPage?: PagedResult<InstitutionWithAdminDto>;
}

export default function InstitutionsClient({
  initialInstitutionsPage,
}: InstitutionsClientProps) {
  const { data: session } = useSession();
  const userRole = Number(session?.user?.role);
  const isElevated = userRole === UserRole.PlatformAdmin;

  const [openAddInstitutionDialog, setOpenAddInstitutionDialog] =
    useState(false);

  const handleClickOpenAddInstitution = () => {
    setOpenAddInstitutionDialog(true);
  };

  const handleCloseAddInstitution = () => {
    setOpenAddInstitutionDialog(false);
  };

  return (
    <Box
      sx={(theme) => ({
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
        boxSizing: 'border-box',
        ...getDashboardPagePadding(theme),
      })}
    >
      <Box sx={{ flexShrink: 0, marginBottom: 2 }}>
        <Stack spacing={2} direction={'row'}>
          <Button
            sx={{ maxWidth: 'max-content' }}
            variant="outlined"
            onClick={handleClickOpenAddInstitution}
            disabled={!isElevated}
          >
            Create institution
          </Button>
        </Stack>
      </Box>
      <Box
        sx={{
          flex: '1 1 0%',
          display: 'flex',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        <OutlinedWrapper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            width: '100%',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          <InstitutionUserDataGrid
            initialInstitutionsPage={initialInstitutionsPage}
          />
        </OutlinedWrapper>
      </Box>

      <EnrollInstitutionModal
        open={openAddInstitutionDialog}
        handleClose={handleCloseAddInstitution}
      />
    </Box>
  );
}
