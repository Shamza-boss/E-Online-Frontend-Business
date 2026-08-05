'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import {
  dashboardFlexBodySx,
  dashboardPageRootSx,
} from '@/app/_lib/layout/dashboardPageLayout';
import CreateClassroomModal from './_components/Modals/CreateClassroomModal';
import RegisterPersonModal from './_components/Modals/RegisterPersonModal';
import CreateSubjectModal from './_components/Modals/CreateSubjectModal';
import CreateAcademicsModal from './_components/Modals/CreateAcademicsModal';
import ManagementHeader from './_components/ManagementHeader';
import ManagementTabs from './_components/ManagementTabs';
import { useManagementState } from './_components/hooks/useManagementState';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { useSession } from 'next-auth/react';
import type { AcademicLevelDto, SubjectDto } from '@/app/_lib/interfaces/types';

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export type ManagementClientProps = {
  initialAcademics?: AcademicLevelDto[];
  initialSubjects?: SubjectDto[];
}

export default function ManagementClient({
  initialAcademics,
  initialSubjects,
}: ManagementClientProps) {
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
    <Box sx={dashboardPageRootSx}>
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

      <Box sx={dashboardFlexBodySx}>
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
            initialAcademics={initialAcademics}
            initialSubjects={initialSubjects}
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
}
