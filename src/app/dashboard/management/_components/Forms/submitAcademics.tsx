'use server';

import { createAcademics } from '@/app/_lib/actions/academics';
import { type AcademicLevelDto } from '@/app/_lib/interfaces/types';
import { academicsSchema } from '@/app/_lib/schemas/management';
import {
  type FormActionPrevState,
  type FormActionState,
} from '@/app/_lib/types/actionState';
import { getCurrentUser } from '@/app/_lib/utils/currentUser';
import { getErrorMessage } from '@/lib/api';
import { parseWithZod } from '@conform-to/zod';

export async function SubmitAcademics(
  _prev: FormActionPrevState<AcademicLevelDto>,
  formData: FormData,
): Promise<FormActionState<AcademicLevelDto>> {
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
    return { status: 'success', data: created };
  } catch (error: unknown) {
    return { status: 'error', message: getErrorMessage(error) };
  }
}
