import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllAcademics, getAllSubjects } from '@/app/_lib/data';
import ManagementClient from './ManagementClient';

export const dynamic = 'force-dynamic';

export default async function ManagementPage() {
  const session = await auth();
  if (!session) {
    redirect('/signin');
  }

  const [initialAcademics, initialSubjects] = await Promise.all([
    getAllAcademics(),
    getAllSubjects(),
  ]);

  return (
    <ManagementClient
      initialAcademics={initialAcademics}
      initialSubjects={initialSubjects}
    />
  );
}
