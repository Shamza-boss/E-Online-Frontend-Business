import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getMySettings } from '@/app/_lib/data/settings';
import SettingsExperience from './_components/SettingsExperience';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await auth();
  if (!session) {
    redirect('/signin');
  }

  const initialSettings = await getMySettings();

  return <SettingsExperience initialSettings={initialSettings} />;
}
