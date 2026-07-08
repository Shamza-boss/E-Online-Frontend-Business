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

  const initialInstitutionsPage = await getInstitutionsPage();

  return (
    <InstitutionsClient initialInstitutionsPage={initialInstitutionsPage} />
  );
}
