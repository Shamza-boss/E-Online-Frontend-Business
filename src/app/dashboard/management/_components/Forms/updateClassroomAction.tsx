'use server';
import { updateClassroom } from '@/app/_lib/actions/classrooms';
import { UpdateClassroomDto } from '@/app/_lib/interfaces/types';
import { classroomSchema } from '@/app/_lib/schemas/management';
import { parseWithZod } from '@conform-to/zod';

export async function UpdateClassroomAction(
  prevState: unknown,
  formData: FormData
) {
  const submission = parseWithZod(formData, { schema: classroomSchema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const classroomId = formData.get('classroomId') as string;
  const isAdmin = formData.get('isAdmin') === 'true';

  if (!isAdmin) {
    throw new Error('Only administrators can update courses');
  }

  const updatedClassroom: UpdateClassroomDto = {
    id: classroomId,
    name: submission.value.name,
    teacherId: submission.value.teacherId || null,
    academicLevelId: submission.value.academicLevelId,
    subjectId: submission.value.subjectId,
  };

  try {
    await updateClassroom(updatedClassroom);
    return { name: submission.value.name };
  } catch (error: any) {
    return error;
  }
}
