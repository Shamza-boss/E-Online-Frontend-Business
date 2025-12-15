import { redirect } from 'next/navigation';
import type { Route } from 'next';
import { auth } from '@/auth';
import SignInComponent from './_components/SignIn';
import { buildDashboardRedirectForSignedInUser } from '@/app/_lib/utils/alreadySignedInNotice';

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    const destination = buildDashboardRedirectForSignedInUser(session) as Route;
    redirect(destination);
  }
  return <SignInComponent />;
}
