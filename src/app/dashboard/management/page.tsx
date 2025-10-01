'use client';
import React, { useState } from 'react';
import { Box, Button, Stack, Tab, Tooltip } from '@mui/material';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CreateClassroomModal from './_components/Modals/CreateClassroomModal';
import RegisterPersonModal from './_components/Modals/RegisterPersonModal';
import ClassManagementDataGrid from './_components/Tables/classManagementDataGrid';
import UserManagementDataGrid from './_components/Tables/userManagementDataGrid';
import { mutate } from 'swr';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { useSession } from 'next-auth/react';
import CreateSubjectModal from './_components/Modals/CreateSubjectModal';
import CreateAcademicsModal from './_components/Modals/CreateAcademicsModal';

const ClassesManagement = () => {
  const { data: session } = useSession();
  const userRole = Number(session?.user?.role);
  const isElevated = userRole === UserRole.Admin;

  const [openRegisterPerson, setOpenRegisterPerson] = useState<boolean>(false);
  const [openClassCreator, setOpnClassCreator] = useState<boolean>(false);
  const [openSubjectCreator, setOpnSubjectCreator] = useState<boolean>(false);
  const [openAcademicsCreator, setOpnAcademicsCreator] =
    useState<boolean>(false);
  const [value, setValue] = useState('1');

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setValue(newValue);
  };

  const handleClickOpen = () => setOpenRegisterPerson(true);
  const handleClickOpenClass = () => setOpnClassCreator(true);
  const handleClickOpenSubject = () => setOpnSubjectCreator(true);
  const handleClickOpenAcademic = () => setOpnAcademicsCreator(true);

  const handleClose = async () => {
    setOpenRegisterPerson(false);
    mutate('users');
  };

  const handleCloseClass = async () => {
    setOpnClassCreator(false);
    mutate('classes');
  };

  const handleCloseAcademics = async () => {
    setOpnAcademicsCreator(false);
  };

  const handleCloseSubjects = async () => {
    setOpnSubjectCreator(false);
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
          marginBottom: 1,
        }}
      >
        <Stack spacing={2} direction={'row'}>
          {value === '2' && (
            <>
              <Tooltip
                title={
                  !isElevated
                    ? 'Only administrators and moderators can make changes on this page. Please contact your administrator for assistance.'
                    : ''
                }
              >
                <span>
                  <Button
                    sx={{ maxWidth: 'max-content' }}
                    variant="outlined"
                    onClick={handleClickOpenClass}
                    disabled={!isElevated}
                  >
                    Create course
                  </Button>
                </span>
              </Tooltip>
              <Button
                sx={{ maxWidth: 'max-content' }}
                variant="outlined"
                onClick={handleClickOpenSubject}
                disabled={!isElevated}
              >
                Create subjects
              </Button>
              <Button
                sx={{ maxWidth: 'max-content' }}
                variant="outlined"
                onClick={handleClickOpenAcademic}
                disabled={!isElevated}
              >
                Create academic levels
              </Button>
            </>
          )}
          {value === '1' && (
            <Tooltip
              title={
                !isElevated
                  ? 'Only administrators and moderators can make changes on this page. Please contact your administrator for assistance.'
                  : ''
              }
            >
              <span>
                <Button
                  sx={{ maxWidth: 'max-content' }}
                  variant="outlined"
                  onClick={handleClickOpen}
                  disabled={!isElevated}
                >
                  Register person
                </Button>
              </span>
            </Tooltip>
          )}
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
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="People" value="1" />
                <Tab label="Courses" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ padding: 0, height: '100%' }}>
              <UserManagementDataGrid />
            </TabPanel>
            <TabPanel value="2" sx={{ padding: 0, height: '100%' }}>
              <ClassManagementDataGrid />
            </TabPanel>
          </TabContext>
        </OutlinedWrapper>
      </Box>
      <RegisterPersonModal
        open={openRegisterPerson}
        handleClose={handleClose}
      />
      <CreateClassroomModal
        open={openClassCreator}
        handleClose={handleCloseClass}
      />
      <CreateSubjectModal
        open={openSubjectCreator}
        handleClose={handleCloseSubjects}
      />
      <CreateAcademicsModal
        open={openAcademicsCreator}
        handleClose={handleCloseAcademics}
      />
    </Box>
  );
};

export default ClassesManagement;
