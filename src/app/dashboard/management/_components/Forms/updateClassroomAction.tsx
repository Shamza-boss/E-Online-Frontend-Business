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
  const textbookKey = (formData.get('textbookKey') as string)?.trim();
  const textbookHash = (formData.get('textbookHash') as string)?.trim();
  const textbookUrl = (formData.get('textbookUrl') as string)?.trim();
  const textbookFileName = (formData.get('textbookFileName') as string)?.trim();
  const textbookFileSizeBytesRaw =
    (formData.get('textbookFileSizeBytes') as string)?.trim();
  const textbookPreviewImageKey =
    (formData.get('textbookPreviewImageKey') as string)?.trim();
  const textbookUploadedAt =
    (formData.get('textbookUploadedAt') as string)?.trim();
  const textbookUploadedByUserId =
    (formData.get('textbookUploadedByUserId') as string)?.trim();

  if (!isAdmin) {
    throw new Error('Only administrators can update courses');
  }

  if (!textbookKey || !textbookHash) {
    throw new Error('Textbook details are required to update the course');
  }

  const textbookFileSizeBytes = textbookFileSizeBytesRaw
    ? Number(textbookFileSizeBytesRaw)
    : undefined;

  const updatedClassroom: UpdateClassroomDto = {
    id: classroomId,
    name: submission.value.name,
    teacherId: submission.value.teacherId || null,
    academicLevelId: submission.value.academicLevelId,
    subjectId: submission.value.subjectId,
    textbookKey,
    textbookHash,
    textbookUrl: textbookUrl || undefined,
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

  try {
    await updateClassroom(updatedClassroom);
    return { name: submission.value.name };
  } catch (error: any) {
    return error;
  }
}
