'use server';
import { updateUser } from '@/app/_lib/actions/users';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { UserDto } from '@/app/_lib/interfaces/types';
import { registrationSchema } from '@/app/_lib/schemas/management';
import { parseWithZod } from '@conform-to/zod';

export async function UpdateUserAction(
  prevState: unknown,
  formData: FormData
) {
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
    role: isAdmin ? parseInt(formData.get('role') as string, 10) as UserRole : currentRole,
  };

  try {
    await updateUser(updatedUser);
    return updatedUser;
  } catch (error: any) {
    return error;
  }
}
