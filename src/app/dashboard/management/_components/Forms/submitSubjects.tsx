'use server';

import { createSubject } from '@/app/_lib/actions/subjects';
import { type SubjectDto } from '@/app/_lib/interfaces/types';
import { subjectsSchema } from '@/app/_lib/schemas/management';
import {
  type FormActionPrevState,
  type FormActionState,
} from '@/app/_lib/types/actionState';
import { getErrorMessage } from '@/lib/api';
import { parseWithZod } from '@conform-to/zod';

export async function SubmitSubject(
  _prev: FormActionPrevState<SubjectDto>,
  formData: FormData,
): Promise<FormActionState<SubjectDto>> {
  const submission = parseWithZod(formData, { schema: subjectsSchema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const newSubject: SubjectDto = {
    name: formData.get('name') as string,
    group: formData.get('group') as string,
    subjectCode: formData.get('subjectCode') as string,
    category: formData.get('category') as string,
  };

  try {
    const created = await createSubject(newSubject);
    return { status: 'success', data: created };
  } catch (error: unknown) {
    return { status: 'error', message: getErrorMessage(error) };
  }
}
