'use server';
import { createUser } from '@/app/_lib/actions/users';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { UserDto } from '@/app/_lib/interfaces/types';
import { registrationSchema } from '@/app/_lib/schemas/management';
import { auth } from '@/auth';
import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';

export async function SubmitForm(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: registrationSchema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  // Get the logged-in user's session to retrieve their institutionId
  const session = await auth();

  if (!session) {
    redirect('/signin');
  }

  const newUser: UserDto = {
    institutionId: session.user.institutionId,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    role: parseInt(formData.get('role') as string, 10) as UserRole,
  };

  try {
    await createUser(newUser);
    return newUser;
  } catch (error: any) {
    return error;
  }
}
