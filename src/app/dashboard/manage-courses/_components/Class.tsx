'use client';
import React, { useState } from 'react';
import { Box, Button, Stack, Tab, Tooltip } from '@mui/material';
import DragDropFormBuilderModal from './Modals/FormBuilderModal';
import {
  ClassDto,
  Homework,
  HomeworkPayload,
  UserDto,
} from '../../../_lib/interfaces/types';
import { useParams } from 'next/navigation';
import {
  createHomework,
  publishHomework,
  updateHomeworkDraft,
  getHomeworkForTeacher,
} from '../../../_lib/actions/homework';
import { OutlinedWrapper } from '../../../_lib/components/shared-theme/customizations/OutlinedWrapper';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import StudentDatagridTable from './Tables/studentTable';
import { GridRowId } from '@mui/x-data-grid';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { useSession } from 'next-auth/react';
import ConditionalTabPanel from '@/app/_lib/components/conditionalTabPanel';
import ModulesDataGrid from './DraftModulesDatagrid';
import StudentAssignmentsModal from './Modals/StudentAssignmentsModal';
import DataGridTabPanel from '@/app/_lib/components/tabs/DataGridTabPanel';

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
  const [assignmentsModalOpen, setAssignmentsModalOpen] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [modulesRefreshIndex, setModulesRefreshIndex] = useState(0);
  const [value, setValue] = useState('1');

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setValue(newValue);
  };

  // Handler when a teacher publishes a new homework.
  const handleModuleSubmit = async (
    homework: HomeworkPayload,
    options: { isDraft: boolean; homeworkId?: string }
  ) => {
    if (options.homeworkId) {
      await updateHomeworkDraft(
        classDetails.teacherId,
        options.homeworkId,
        homework
      );

      if (!options.isDraft) {
        await publishHomework(classDetails.teacherId, options.homeworkId);
      }
    } else {
      await createHomework(
        homework,
        classDetails.teacherId,
        classroomId,
        options.isDraft
      );
    }

    setModulesRefreshIndex((prev) => prev + 1);
  };

  const handleEditDraftModule = async (homeworkId: string) => {
    try {
      const homework = await getHomeworkForTeacher(
        classDetails.teacherId,
        homeworkId
      );
      setEditingHomework(homework);
      setBuilderOpen(true);
    } catch (error) {
      console.error('Failed to load homework for editing', error);
    }
  };

  const handleSeeHomeworkClick = (id: GridRowId) => () => {
    if (!isElevated) return; // Prevent selection if not a Teacher
    const selectedUser = userData?.find((user) => user.userId === id);
    setSelectedStudent(selectedUser || null);
    if (selectedUser) {
      setAssignmentsModalOpen(true);
    }
  };

  const handleBuilderClose = () => {
    setBuilderOpen(false);
    setEditingHomework(null);
  };

  const handleAssignmentsClose = () => {
    setAssignmentsModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: 3,
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
                onClick={() => {
                  setEditingHomework(null);
                  setBuilderOpen(true);
                }}
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
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            width: '100%',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          <DragDropFormBuilderModal
            open={builderOpen}
            onClose={handleBuilderClose}
            onSubmit={handleModuleSubmit}
            initialHomework={editingHomework}
          />

          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="manage classroom">
                <Tab label="Trainees" value="1" />
                <Tab label="All modules" value="2" />
              </TabList>
            </Box>

            <DataGridTabPanel value="1">
              <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
                <StudentDatagridTable
                  userData={userData}
                  usersLoading={false}
                  handleSeeHomeworkClick={handleSeeHomeworkClick}
                />
              </Box>
            </DataGridTabPanel>

            <DataGridTabPanel value="2">
              <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
                <ModulesDataGrid
                  teacherId={classDetails.teacherId}
                  classroomId={classroomId}
                  refreshIndex={modulesRefreshIndex}
                  onEdit={handleEditDraftModule}
                  onAfterChange={() =>
                    setModulesRefreshIndex((prev) => prev + 1)
                  }
                />
              </Box>
            </DataGridTabPanel>
          </TabContext>
        </OutlinedWrapper>
      </Box>
      <StudentAssignmentsModal
        open={assignmentsModalOpen}
        onClose={handleAssignmentsClose}
        student={selectedStudent}
        classId={classroomId}
      />
    </Box>
  );
}
