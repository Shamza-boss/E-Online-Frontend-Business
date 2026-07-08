import { getAllAcademics } from '@/app/_lib/actions/academics';
import LibraryClient from './LibraryClient';

export default async function LibraryPage() {
  const initialAcademics = await getAllAcademics();

  return <LibraryClient initialAcademics={initialAcademics} />;
}
