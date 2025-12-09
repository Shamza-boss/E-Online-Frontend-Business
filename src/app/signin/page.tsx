import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import SignInComponent from './_components/SignIn';
import { buildDashboardRedirectForSignedInUser } from '@/app/_lib/utils/alreadySignedInNotice';

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect(buildDashboardRedirectForSignedInUser(session));
  }
  return <SignInComponent />;
}
