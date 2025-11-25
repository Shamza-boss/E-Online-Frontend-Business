import { redirect } from 'next/navigation';
import { getMySettings } from '@/app/_lib/actions/settings';
import SettingsExperience from './_components/SettingsExperience';

export default async function SettingsPage() {
  const settings = await getMySettings().catch(() => null);

  if (!settings) {
    redirect('/signin');
  }

  return <SettingsExperience data={settings} />;
}
