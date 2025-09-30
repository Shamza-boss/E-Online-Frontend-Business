'use server';

import { createInstitution } from '@/app/_lib/actions/institution';
import { InstitutionWithAdminDto } from '@/app/_lib/interfaces/types';
import { institutionSchema } from '@/app/_lib/schemas/management';
import { parseWithZod } from '@conform-to/zod';

export async function SubmitInstitution(
  prevState: unknown,
  formData: FormData
) {
  const submission = parseWithZod(formData, { schema: institutionSchema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const newInstitution = {
    institution: {
      name: formData.get('institutionName') as string,
      adminEmail: formData.get('adminEmail') as string,
      isActive: true,
    },
    admin: {
      firstName: formData.get('adminFirstName') as string,
      lastName: formData.get('adminLastName') as string,
      email: formData.get('adminEmail') as string,
    },
  } as InstitutionWithAdminDto;

  try {
    await createInstitution(newInstitution);
    return {
      success: true,
      institution: newInstitution.institution.name,
    };
  } catch (error: any) {
    console.error('Institution creation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create institution',
    };
  }
}
