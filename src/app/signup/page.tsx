import { redirect } from 'next/navigation';
import SignUpPage from './_components/SignUp';
import { auth } from '@/auth';

export default async function SignUp() {
  const session = await auth();
  if (session) {
    redirect('/signin');
  }
  return <SignUpPage />;
}
