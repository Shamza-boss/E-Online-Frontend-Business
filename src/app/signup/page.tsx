import { redirect } from 'next/navigation';
import type { Route } from 'next';
import SignUpPage from './_components/SignUp';
import { auth } from '@/auth';
import { buildDashboardRedirectForSignedInUser } from '@/app/_lib/utils/alreadySignedInNotice';

export default async function SignUp() {
  const session = await auth();
  if (session) {
    const destination = buildDashboardRedirectForSignedInUser(session) as Route;
    redirect(destination);
  }
  return <SignUpPage />;
}
