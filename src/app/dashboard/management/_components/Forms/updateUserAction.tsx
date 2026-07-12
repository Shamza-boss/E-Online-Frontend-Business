'use server';
import { updateUser } from '@/app/_lib/actions/users';
import { type UserRole } from '@/app/_lib/Enums/UserRole';
import { type UserDto } from '@/app/_lib/interfaces/types';
import { registrationSchema } from '@/app/_lib/schemas/management';
import {
  type FormActionPrevState,
  type FormActionState,
} from '@/app/_lib/types/actionState';
import { getErrorMessage } from '@/lib/api';
import { parseWithZod } from '@conform-to/zod';

export async function UpdateUserAction(
  _prev: FormActionPrevState<UserDto>,
  formData: FormData,
): Promise<FormActionState<UserDto>> {
  const submission = parseWithZod(formData, { schema: registrationSchema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const userId = formData.get('userId') as string;
  const institutionId = formData.get('institutionId') as string;
  const currentRole = parseInt(formData.get('currentRole') as string, 10) as UserRole;
  const isAdmin = formData.get('isAdmin') === 'true';

  const updatedUser: UserDto = {
    userId,
    institutionId,
    firstName: submission.value.firstName,
    lastName: submission.value.lastName,
    email: submission.value.email,
    role: isAdmin
      ? (parseInt(formData.get('role') as string, 10) as UserRole)
      : currentRole,
  };

  try {
    await updateUser(updatedUser);
    return { status: 'success', data: updatedUser };
  } catch (error: unknown) {
    return { status: 'error', message: getErrorMessage(error) };
  }
}
