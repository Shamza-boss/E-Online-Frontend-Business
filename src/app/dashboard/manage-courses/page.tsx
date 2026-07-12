import { getAllUserClassrooms } from '@/app/_lib/data/classrooms';
import StudentClassesManagementClient from './clientPage';

export default async function StudentClassesManagementWrapper() {
  const classes = await getAllUserClassrooms();

  return <StudentClassesManagementClient fallbackClasses={classes} />;
}
