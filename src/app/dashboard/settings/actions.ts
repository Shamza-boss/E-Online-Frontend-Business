'use server';

import { revalidatePath } from 'next/cache';
import { updateUser } from '@/app/_lib/actions/users';
import { getCurrentUser } from '@/app/_lib/utils/currentUser';

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
}

export async function updateProfileAction(payload: UpdateProfilePayload) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.userId) {
    throw new Error('You need to be signed in to update your profile.');
  }

  const normalizedFirstName = payload.firstName?.trim();
  const normalizedLastName = payload.lastName?.trim();

  if (!normalizedFirstName || !normalizedLastName) {
    throw new Error('Please provide both your first and last name.');
  }

  if (!currentUser.email) {
    throw new Error(
      'Your profile is missing an email address. Please contact support.'
    );
  }

  if (!currentUser.institutionId) {
    throw new Error(
      'Your profile is missing an institution. Please contact support.'
    );
  }

  await updateUser({
    userId: currentUser.userId,
    institutionId: currentUser.institutionId,
    firstName: normalizedFirstName,
    lastName: normalizedLastName,
    email: currentUser.email,
    role: currentUser.role ?? null,
  });

  revalidatePath('/dashboard/settings');

  return {
    firstName: normalizedFirstName,
    lastName: normalizedLastName,
  } as const;
}
