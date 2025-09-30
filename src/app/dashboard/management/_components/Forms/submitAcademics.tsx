'use server';

import { createAcademics } from '@/app/_lib/actions/academics';
import { AcademicLevelDto } from '@/app/_lib/interfaces/types';
import { academicsSchema } from '@/app/_lib/schemas/management';
import { parseWithZod } from '@conform-to/zod';

export async function SubmitAcademics(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: academicsSchema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const newAcademics: AcademicLevelDto = {
    name: formData.get('name') as string,
    country: formData.get('country') as string,
    educationSystem: formData.get('educationSystem') as string,
  };

  try {
    await createAcademics(newAcademics);
    return newAcademics;
  } catch (error: any) {
    return error;
  }
}
