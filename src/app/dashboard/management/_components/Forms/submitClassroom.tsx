'use server';
import { createClassroom } from '@/app/_lib/actions/classrooms';
import { ClassDto } from '@/app/_lib/interfaces/types';
import { classroomSchema } from '@/app/_lib/schemas/management';
import { parseWithZod } from '@conform-to/zod';

function parseTextbookFields(formData: FormData) {
  const textbookKey = (formData.get('textbookKey') as string)?.trim();
  const textbookHash = (formData.get('textbookHash') as string)?.trim();
  const textbookUrl = (formData.get('textbookUrl') as string)?.trim();
  const textbookFileName = (formData.get('textbookFileName') as string)?.trim();
  const textbookFileSizeBytesRaw = (
    formData.get('textbookFileSizeBytes') as string
  )?.trim();
  const textbookPreviewImageKey = (
    formData.get('textbookPreviewImageKey') as string
  )?.trim();
  const textbookUploadedAt = (
    formData.get('textbookUploadedAt') as string
  )?.trim();
  const textbookUploadedByUserId = (
    formData.get('textbookUploadedByUserId') as string
  )?.trim();

  const textbookFileSizeBytes = textbookFileSizeBytesRaw
    ? Number(textbookFileSizeBytesRaw)
    : undefined;

  return {
    textbookKey,
    textbookHash,
    textbookUrl,
    textbookFileName: textbookFileName || undefined,
    textbookFileSizeBytes:
      typeof textbookFileSizeBytes === 'number' &&
      Number.isFinite(textbookFileSizeBytes)
        ? textbookFileSizeBytes
        : undefined,
    textbookPreviewImageKey: textbookPreviewImageKey || undefined,
    textbookUploadedAt: textbookUploadedAt || undefined,
    textbookUploadedByUserId: textbookUploadedByUserId || undefined,
  };
}

export async function SubmitClassroom(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: classroomSchema });
  if (submission.status !== 'success') {
    return submission.reply();
  }

  const textbook = parseTextbookFields(formData);

  const newClassroom: ClassDto = {
    name: formData.get('name') as string,
    teacherId: formData.get('teacherId') as string,
    academicLevelId: formData.get('academicLevelId') as string,
    subjectId: formData.get('subjectId') as string,
    ...textbook,
  };

  try {
    await createClassroom(newClassroom);
    return newClassroom;
  } catch (error: any) {
    return error;
  }
}
