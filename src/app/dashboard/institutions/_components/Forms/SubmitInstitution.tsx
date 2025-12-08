'use server';

import { createInstitution } from '@/app/_lib/actions/institutions';
import {
  InstitutionWithAdminDto,
  SubscriptionFeatureFlag,
  SubscriptionPlan,
} from '@/app/_lib/interfaces/types';
import { institutionSchema } from '@/app/_lib/schemas/management';
import { parseWithZod } from '@conform-to/zod';
import { planToFeatureFlag } from '@/app/_lib/utils/subscriptions';

export async function SubmitInstitution(
  prevState: unknown,
  formData: FormData
) {
  const submission = parseWithZod(formData, { schema: institutionSchema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const rawPlan = (formData.get('subscriptionPlan') as SubscriptionPlan) ?? 'Standard';
  const normalizedPlan: SubscriptionPlan =
    rawPlan === 'Enterprise' ? 'Enterprise' : 'Standard';

  const creatorEnabledValue = formData.get('creatorEnabled');
  const creatorEnabled =
    creatorEnabledValue === 'on' ||
    creatorEnabledValue === 'true' ||
    creatorEnabledValue === '1';

  const normalizedFeatures: SubscriptionFeatureFlag = planToFeatureFlag(
    normalizedPlan
  );

  const newInstitution = {
    institution: {
      name: formData.get('institutionName') as string,
      adminEmail: formData.get('adminEmail') as string,
      isActive: true,
      plan: normalizedFeatures,
      creatorEnabled,
    },
    admin: {
      firstName: formData.get('adminFirstName') as string,
      lastName: formData.get('adminLastName') as string,
      email: formData.get('adminEmail') as string,
    },
  } as InstitutionWithAdminDto;

  console.log('Creating institution with data:', newInstitution);

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
