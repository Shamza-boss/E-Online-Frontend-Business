'use client';
import {
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  Button,
} from '@mui/material';
import { useForm, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState, useEffect, useRef } from 'react';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { classroomSchema } from '@/app/_lib/schemas/management';
import { type ClassroomDetailsDto, type UserDto, type AcademicLevelDto, type SubjectDto } from '@/app/_lib/interfaces/types';
import { UpdateClassroomAction } from './updateClassroomAction';
import { isFormActionSuccess } from '@/app/_lib/types/actionState';

type EditClassroomFormProps = {
  classroom: ClassroomDetailsDto | null;
  isAdmin: boolean;
  handleClose: () => void;
  onSuccess?: () => void;
  teachers: UserDto[];
  academicLevels: AcademicLevelDto[];
  subjects: SubjectDto[];
}

export default function EditClassroomForm({ 
  classroom, 
  isAdmin, 
  handleClose, 
  onSuccess,
  teachers,
  academicLevels,
  subjects
}: EditClassroomFormProps) {
  if (!classroom) {
    return null;
  }
  
  const { showAlert } = useAlert();
  const [lastResult, action, pending] = useActionState(UpdateClassroomAction, null);
  const isMountedRef = useRef(true);
  
  // Find IDs by matching names since the classroom object only has names, not IDs
  const academicLevelIdValue = classroom.academicLevelId ?? 
    academicLevels.find(level => level.name === classroom.academicLevelName)?.id ?? '';
  
  const subjectIdValue = classroom.subjectId ?? 
    subjects.find(subject => subject.name === classroom.subjectName)?.id ?? '';
  
  const formId = `edit-classroom-${classroom.classroomId}`;
  const [form, { name, teacherId, academicLevelId, subjectId }] = useForm({
    id: formId,
    lastResult,
    defaultValue: {
      name: classroom.classroomName,
      teacherId: classroom.teacherId ?? '',
      academicLevelId: academicLevelIdValue,
      subjectId: subjectIdValue,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: classroomSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isFormActionSuccess(lastResult) && isMountedRef.current) {
      showAlert(
        'success',
        `${lastResult.data.name} updated successfully🚀!`,
      );
      
      // Call onSuccess to refresh data
      if (onSuccess) {
        onSuccess();
      }
      
      // Delay close to allow async operations to complete
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          handleClose();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult]);

  return (
    <Box
      key={classroom.classroomId}
      component="form"
      {...getFormProps(form)}
      action={action}
      sx={{ padding: 3 }}
    >
      <input type="hidden" name="classroomId" value={classroom.classroomId} />
      <input type="hidden" name="isAdmin" value={String(isAdmin)} />

      <TextField
        placeholder="Course Name"
        label="Course Name"
        key={name.key}
        name={name.name}
        defaultValue={name.initialValue || classroom.classroomName}
        error={!name.valid}
        helperText={name.errors || ''}
        fullWidth
        margin="normal"
        disabled={!isAdmin}
      />
      
      <FormControl fullWidth error={!teacherId.valid} margin="normal" disabled={!isAdmin}>
        <InputLabel id="edit-teacher-label">Instructor</InputLabel>
        <Select
          labelId="edit-teacher-label"
          label="Instructor"
          key={teacherId.key}
          name={teacherId.name}
          defaultValue={teacherId.initialValue ?? classroom.teacherId ?? ''}
          readOnly={!isAdmin}
        >
          {teachers.map((teacher) => (
            <MenuItem key={teacher.userId} value={teacher.userId}>
              {teacher.firstName} {teacher.lastName}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {!isAdmin ? 'Only administrators can change instructors' : (teacherId.errors || '')}
        </FormHelperText>
      </FormControl>

      <FormControl fullWidth error={!academicLevelId.valid} margin="normal" disabled={!isAdmin}>
        <InputLabel id="edit-academic-label">Grade Level</InputLabel>
        <Select
          labelId="edit-academic-label"
          label="Grade Level"
          key={academicLevelId.key}
          name={academicLevelId.name}
          defaultValue={academicLevelId.initialValue ?? classroom.academicLevelId ?? ''}
          readOnly={!isAdmin}
        >
          {academicLevels.map((level) => (
            <MenuItem key={level.id} value={level.id}>
              {level.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {!isAdmin ? 'Only administrators can change grade levels' : (academicLevelId.errors || '')}
        </FormHelperText>
      </FormControl>

      <FormControl fullWidth error={!subjectId.valid} margin="normal" disabled={!isAdmin}>
        <InputLabel id="edit-subject-label">Subject</InputLabel>
        <Select
          labelId="edit-subject-label"
          label="Subject"
          key={subjectId.key}
          name={subjectId.name}
          defaultValue={subjectId.initialValue ?? classroom.subjectId ?? ''}
          readOnly={!isAdmin}
        >
          {subjects.map((subject) => (
            <MenuItem key={subject.id} value={subject.id}>
              {subject.name} — {subject.subjectCode}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {!isAdmin ? 'Only administrators can change subjects' : (subjectId.errors || '')}
        </FormHelperText>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
        <Button
          type="submit"
          loading={pending}
          variant="contained"
          disabled={!isAdmin}
          sx={{ minWidth: 100 }}
        >
          {pending ? 'Saving…' : 'Update Course'}
        </Button>
      </Box>
    </Box>
  );
}
