'use server';
import { createUser } from '@/app/_lib/actions/users';
import { type UserRole } from '@/app/_lib/Enums/UserRole';
import { type UserDto } from '@/app/_lib/interfaces/types';
import { registrationSchema } from '@/app/_lib/schemas/management';
import {
  type FormActionPrevState,
  type FormActionState,
} from '@/app/_lib/types/actionState';
import { auth } from '@/auth';
import { getErrorMessage } from '@/lib/api';
import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';

export async function SubmitForm(
  _prev: FormActionPrevState<UserDto>,
  formData: FormData,
): Promise<FormActionState<UserDto>> {
  const submission = parseWithZod(formData, { schema: registrationSchema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const session = await auth();

  if (!session) {
    redirect('/signin');
  }

  const institutionId = session.user.institutionId;
  if (!institutionId) {
    redirect('/signin');
  }

  const newUser: UserDto = {
    institutionId,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    role: parseInt(formData.get('role') as string, 10) as UserRole,
  };

  try {
    await createUser(newUser);
    return { status: 'success', data: newUser };
  } catch (error: unknown) {
    return { status: 'error', message: getErrorMessage(error) };
  }
}
