'use server';

import { createAcademics } from '@/app/_lib/actions/academics';
import { AcademicLevelDto } from '@/app/_lib/interfaces/types';
import { academicsSchema } from '@/app/_lib/schemas/management';
import { getCurrentUser } from '@/app/_lib/utils/currentUser';
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
    const currentUser = await getCurrentUser();
    if (!currentUser?.institutionId) {
      throw new Error('An institution is required to create academic levels.');
    }

    const created = await createAcademics({
      ...newAcademics,
      institutionId: currentUser.institutionId,
    });
    return (created as AcademicLevelDto) ?? newAcademics;
  } catch (error: any) {
    return error;
  }
}
