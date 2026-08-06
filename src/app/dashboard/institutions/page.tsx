import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getInstitutionsPage } from '@/app/_lib/data';
import InstitutionsClient from './InstitutionsClient';

export const dynamic = 'force-dynamic';

export default async function InstitutionsPage() {
  const session = await auth();
  if (!session) {
    redirect('/signin');
  }

  try {
    const initialInstitutionsPage = await getInstitutionsPage();
    return (
      <InstitutionsClient initialInstitutionsPage={initialInstitutionsPage} />
    );
  } catch (error) {
    console.error('[InstitutionsPage] failed to load institutions', error);
    // Soft-fail: client re-fetches via SWR instead of poisoning soft navigation.
    return <InstitutionsClient />;
  }
}
