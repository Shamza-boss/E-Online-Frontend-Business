'use server';

import { createSubject } from '@/app/_lib/actions/subjects';
import { SubjectDto } from '@/app/_lib/interfaces/types';
import { subjectsSchema } from '@/app/_lib/schemas/management';
import { parseWithZod } from '@conform-to/zod';

export async function SubmitSubject(prevState: unknown, formData: FormData) {
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
    await createSubject(newSubject);
    return newSubject;
  } catch (error: any) {
    return error;
  }
}
