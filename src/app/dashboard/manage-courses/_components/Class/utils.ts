import type { Homework, HomeworkPayload } from '@/app/_lib/interfaces/types';
import {
  createHomework,
  publishHomework,
  updateHomeworkDraft,
  getHomeworkForTeacher,
} from '@/app/_lib/actions/homework';
import type { GridRowId } from '@mui/x-data-grid';
import type { UserDto } from '@/app/_lib/interfaces/types';

export const handleModuleSubmit = async (
  homework: HomeworkPayload,
  options: { isDraft: boolean; homeworkId?: string },
  teacherId: string,
  classroomId: string,
  onRefresh: () => void
) => {
  if (options.homeworkId) {
    await updateHomeworkDraft(teacherId, options.homeworkId, homework);
    if (!options.isDraft) {
      await publishHomework(teacherId, options.homeworkId);
    }
  } else {
    await createHomework(homework, teacherId, classroomId, options.isDraft);
  }
  onRefresh();
};

export const handleEditDraftModule = async (
  homeworkId: string,
  teacherId: string,
  setEditingHomework: (hw: Homework) => void,
  setBuilderOpen: (open: boolean) => void
) => {
  try {
    const homework = await getHomeworkForTeacher(teacherId, homeworkId);
    setEditingHomework(homework);
    setBuilderOpen(true);
  } catch (error) {
    console.error('Failed to load homework for editing', error);
  }
};

export const createSeeHomeworkHandler =
  (
    isElevated: boolean,
    userData: UserDto[] | undefined,
    setSelectedStudent: (user: UserDto | null) => void,
    setAssignmentsModalOpen: (open: boolean) => void
  ) =>
  (id: GridRowId) =>
  () => {
    if (!isElevated) return;
    const selectedUser = userData?.find((user) => user.userId === id);
    setSelectedStudent(selectedUser || null);
    if (selectedUser) {
      setAssignmentsModalOpen(true);
    }
  };
