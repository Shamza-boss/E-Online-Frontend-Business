'use client';
import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, Tab, Tooltip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DragDropFormBuilderModal from './Modals/FormBuilderModal';
import { ClassDto, Homework, UserDto } from '../../../_lib/interfaces/types';
import { useParams } from 'next/navigation';
import { createHomework } from '../../../_lib/actions/homework';
import { OutlinedWrapper } from '../../../_lib/components/shared-theme/customizations/OutlinedWrapper';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import StudentDatagridTable from './Tables/studentTable';
import { GridRowId } from '@mui/x-data-grid';
import ManageStudentHomework from './Homework/ManageStudentHomework';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { useSession } from 'next-auth/react';
import ConditionalTabPanel from '@/app/_lib/components/conditionalTabPanel';

interface StudentManagementComponentProps {
  userData: UserDto[] | undefined;
  classDetails: ClassDto;
}

export default function StudentManagementComponent({
  userData,
  classDetails,
}: StudentManagementComponentProps) {
  const { data: session } = useSession();
  const params = useParams();
  const userRole = Number(session?.user?.role);
  const isElevated = userRole === UserRole.Instructor;
  const slug = params.slug as string;

  // Decode and extract the classroomId
  const decodedSlug = decodeURIComponent(slug);
  const [, classroomId] = decodedSlug.split('~');

  const [builderOpen, setBuilderOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<UserDto | null>(null);
  const [value, setValue] = useState('1');

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (selectedStudent) {
      setValue('2');
    }
  }, [selectedStudent]);

  // Handler when a teacher publishes a new homework.
  const handlePublish = async (homework: Homework) => {
    //should admins be able to publish homework for classrooms that they dont own?
    //Should we track the user id that initiates the classroom creation?
    //should admins be able to publish homework ?
    const submitHomework = await createHomework(
      homework,
      classDetails.teacherId,
      classroomId,
      false
    );
  };

  const handleSeeHomeworkClick = (id: GridRowId) => () => {
    if (!isElevated) return; // Prevent selection if not a Teacher
    const selectedUser = userData?.find((user) => user.userId === id);
    setSelectedStudent(selectedUser || null);
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
        <Stack spacing={1} direction={'row'}>
          <Tooltip
            title={
              !isElevated ? 'Only the class teacher can publish homework.' : ''
            }
          >
            <span>
              <Button
                variant="outlined"
                onClick={() => setBuilderOpen(true)}
                sx={{ mr: 2 }}
                disabled={!isElevated}
              >
                Create module
              </Button>
            </span>
          </Tooltip>
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
          height="80vh"
          width="100%"
          maxHeight="80vh"
          overflow="hidden"
        >
          <DragDropFormBuilderModal
            open={builderOpen}
            onClose={() => setBuilderOpen(false)}
            onPublish={handlePublish}
          />

          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="review trainees">
                <Tab label="Trainees" value="1" />
                <Tab
                  label={
                    selectedStudent == null ? (
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <span>Review trainees</span>
                        <Tooltip title="Please select a trainee to review">
                          <InfoOutlinedIcon
                            sx={{ fontSize: 16, opacity: 0.8 }}
                          />
                        </Tooltip>
                      </Stack>
                    ) : (
                      'Review trainees'
                    )
                  }
                  value="2"
                />
              </TabList>
            </Box>

            <ConditionalTabPanel value={value} index="1">
              <Box
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0,
                }}
              >
                <StudentDatagridTable
                  userData={userData}
                  usersLoading={false}
                  handleSeeHomeworkClick={handleSeeHomeworkClick}
                />
              </Box>
            </ConditionalTabPanel>

            <ConditionalTabPanel value={value} index="2">
              {selectedStudent == null ? (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={2}
                  sx={{ p: 4, height: '100%' }}
                >
                  <InfoOutlinedIcon color="info" sx={{ fontSize: 48 }} />
                  <Typography variant="subtitle1" color="text.secondary">
                    Please select a trainee from the trainees tab to review.
                  </Typography>
                </Stack>
              ) : (
                <Box
                  sx={{
                    flex: 1,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                  }}
                >
                  <ManageStudentHomework
                    classId={classroomId}
                    student={selectedStudent}
                  />
                </Box>
              )}
            </ConditionalTabPanel>
          </TabContext>
        </OutlinedWrapper>
      </Box>
    </Box>
  );
}
