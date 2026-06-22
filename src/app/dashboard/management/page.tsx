'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import CreateClassroomModal from './_components/Modals/CreateClassroomModal';
import RegisterPersonModal from './_components/Modals/RegisterPersonModal';
import CreateSubjectModal from './_components/Modals/CreateSubjectModal';
import CreateAcademicsModal from './_components/Modals/CreateAcademicsModal';
import ManagementHeader from './_components/ManagementHeader';
import ManagementTabs from './_components/ManagementTabs';
import { useManagementState } from './_components/hooks/useManagementState';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { useSession } from 'next-auth/react';

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

const ClassesManagement = () => {
  const { data: session } = useSession();
  const userRole = Number(session?.user?.role);
  const isElevated = userRole === UserRole.Admin;

  const {
    openRegisterPerson,
    openClassCreator,
    openSubjectCreator,
    openAcademicsCreator,
    activeTab,
    setActiveTab,
    handleOpenRegisterPerson,
    handleOpenClassCreator,
    handleOpenSubjectCreator,
    handleOpenAcademicsCreator,
    handleCloseRegisterPerson,
    handleCloseClassCreator,
    handleCloseAcademicsCreator,
    handleCloseSubjectCreator,
  } = useManagementState();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  useEffect(() => {
    setSearchTerm('');
  }, [activeTab]);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: 3
      }}
    >
      <Box sx={{ flexShrink: 0, marginBottom: 1 }}>
        <ManagementHeader
          activeTab={activeTab}
          isElevated={isElevated}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onOpenRegisterPerson={handleOpenRegisterPerson}
          onOpenClassCreator={handleOpenClassCreator}
          onOpenSubjectCreator={handleOpenSubjectCreator}
          onOpenAcademicsCreator={handleOpenAcademicsCreator}
        />
      </Box>

      <Box sx={{ flex: '1 1 0%', display: 'flex', overflow: 'hidden', minHeight: 0 }}>
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
          <ManagementTabs
            activeTab={activeTab}
            onTabChange={(_, newValue) => setActiveTab(newValue)}
            searchTerm={debouncedSearch}
          />
        </OutlinedWrapper>
      </Box>

      <RegisterPersonModal
        open={openRegisterPerson}
        handleClose={handleCloseRegisterPerson}
      />
      <CreateClassroomModal
        open={openClassCreator}
        handleClose={handleCloseClassCreator}
      />
      <CreateSubjectModal
        open={openSubjectCreator}
        handleClose={handleCloseSubjectCreator}
      />
      <CreateAcademicsModal
        open={openAcademicsCreator}
        handleClose={handleCloseAcademicsCreator}
      />
    </Box>
  );
};

export default ClassesManagement;
