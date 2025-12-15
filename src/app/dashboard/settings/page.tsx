import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import SettingsExperience from './_components/SettingsExperience';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SettingsPage() {
  const session = await auth();
  if (!session) {
    redirect('/signin');
  }

  return <SettingsExperience />;
}
