import type { GridRowSelectionModel } from '@mui/x-data-grid';
import type { NormalizedSelection } from './interfaces';
import type { EnrollStudentsDto, UserDto } from '@/app/_lib/interfaces/types';
import { EnrollStudents, UnenrollStudents } from '@/app/_lib/actions';

export const normalizeSelectionModel = (
  selectedIds: GridRowSelectionModel
): NormalizedSelection => {
  if (Array.isArray(selectedIds)) {
    return { type: 'include', ids: new Set(selectedIds.map(String)) };
  }
  return {
    type: selectedIds.type,
    ids: new Set(Array.from(selectedIds.ids).map(String)),
  };
};

export const computeSelectableStudentIds = (
  classId: string,
  studentsWithIds: (UserDto & { userId: string })[],
  enrolledIds: Set<string>
): string[] => {
  if (!classId) return [];
  return studentsWithIds
    .filter((student) => !enrolledIds.has(student.userId))
    .map((student) => student.userId);
};

export const computeSelectedStudentIds = (
  classId: string,
  normalizedSelection: NormalizedSelection,
  selectableStudentIds: string[],
  selectableStudentIdSet: Set<string>
): string[] => {
  if (!classId) return [];
  if (normalizedSelection.type === 'exclude') {
    return selectableStudentIds.filter(
      (id) => !normalizedSelection.ids.has(id)
    );
  }
  return Array.from(normalizedSelection.ids).filter((id) =>
    selectableStudentIdSet.has(id)
  ) as string[];
};

export const assignToClass = async (
  classId: string,
  selectedStudentIds: string[],
  showAlert: (...args: any[]) => void,
  resetSelection: () => void,
  mutateEnrolledStudents: () => Promise<unknown>
) => {
  if (classId && selectedStudentIds.length > 0) {
    const payload: EnrollStudentsDto = {
      classroomId: classId,
      studentIds: selectedStudentIds,
    };
    await EnrollStudents(payload);
    resetSelection();
    showAlert(
      'success',
      `Successfully enrolled ${payload.studentIds.length} students to the class.`
    );
    await mutateEnrolledStudents();
  }
};

export const unenrollStudent = async (
  studentId: string,
  classId: string,
  showAlert: (...args: any[]) => void,
  setUnenrollingId: (id: string | null) => void,
  mutateEnrolledStudents: () => Promise<unknown>
) => {
  if (!classId) return;
  setUnenrollingId(studentId);
  try {
    await UnenrollStudents({ classroomId: classId, studentIds: [studentId] });
    showAlert('success', 'Student removed from the class.');
    await mutateEnrolledStudents();
  } catch (error) {
    console.error('[UnenrollStudents]', error);
    showAlert('error', 'Unable to remove the student. Please try again.');
  } finally {
    setUnenrollingId(null);
  }
};
