'use client';
import React, { useState } from 'react';
import { Box, Button, Stack, Tooltip } from '@mui/material';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import InstitutionUserDataGrid from './_components/Tables/InstitutionUserDataGrid';
import EnrollInstitutionModal from './_components/Modals/EnrollInstitutionModal';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { useSession } from 'next-auth/react';

const ManageInstitutions = () => {
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
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          marginBottom: 2,
        }}
      >
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
          flex: 1, // Allow this box to grow and fill the available space
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <OutlinedWrapper
          display="flex"
          flexDirection="column"
          height="80vh" // Set the height as required
          width="100%"
          maxHeight="80vh"
          overflow="hidden"
        >
          <InstitutionUserDataGrid />
        </OutlinedWrapper>
      </Box>

      <EnrollInstitutionModal
        open={openAddInstitutionDialog}
        handleClose={handleCloseAddInstitution}
      />
    </Box>
  );
};

export default ManageInstitutions;
