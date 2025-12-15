'use server';
import { createClassroom } from '@/app/_lib/actions/classrooms';
import { ClassDto } from '@/app/_lib/interfaces/types';
import { classroomSchema } from '@/app/_lib/schemas/management';
import { parseWithZod } from '@conform-to/zod';

export async function SubmitClassroom(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: classroomSchema });
  if (submission.status !== 'success') {
    return submission.reply();
  }

  const newClassroom: ClassDto = {
    name: formData.get('name') as string,
    teacherId: formData.get('teacherId') as string,
    academicLevelId: formData.get('academicLevelId') as string,
    subjectId: formData.get('subjectId') as string,
    textbookKey: formData.get('textbookKey') as string,
    textbookHash: formData.get('textbookHash') as string,
    textbookUrl: formData.get('textbookUrl') as string,
  };

  try {
    await createClassroom(newClassroom);
    return newClassroom;
  } catch (error: any) {
    return error;
  }
}
