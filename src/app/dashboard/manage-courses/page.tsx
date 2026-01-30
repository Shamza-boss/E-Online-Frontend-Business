import { getAllUserClassrooms } from '@/app/_lib/actions/classrooms';
import StudentClassesManagementClient from './clientPage';

export default async function StudentClassesManagementWrapper() {
  // Prefetch on server - this data will be used as SWR fallback
  const classes = await getAllUserClassrooms();
  
  return (
    <StudentClassesManagementClient fallbackClasses={classes} />
  );
}
