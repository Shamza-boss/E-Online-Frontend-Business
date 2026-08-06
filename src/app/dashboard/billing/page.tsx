import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import {
  getAllInstitutionsList,
  getInstitutionBillingDashboard,
} from '@/app/_lib/data';
import BillingExperience from './_components/BillingExperience';

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
  const session = await auth();
  if (!session) {
    redirect('/signin');
  }

  const role = Number(session.user?.role);
  if (role !== UserRole.PlatformAdmin) {
    return <BillingExperience />;
  }

  try {
    const initialInstitutions = await getAllInstitutionsList();
    // Billing dashboard depends on the first institution id — must stay sequential.
    const initialInstitutionId = initialInstitutions[0]?.institution?.id;
    const initialBillingDashboard = initialInstitutionId
      ? await getInstitutionBillingDashboard(initialInstitutionId)
      : undefined;

    return (
      <BillingExperience
        initialInstitutions={initialInstitutions}
        initialInstitutionId={initialInstitutionId}
        initialBillingDashboard={initialBillingDashboard}
      />
    );
  } catch (error) {
    console.error('[BillingPage] failed to load billing bootstrap data', error);
    // Soft-fail: client loads institutions/billing via SWR instead of SSR throw.
    return <BillingExperience />;
  }
}
