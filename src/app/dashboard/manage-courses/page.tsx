import { SWRConfig } from 'swr';
import { getAllUserClassrooms } from '@/app/_lib/actions/classrooms';
import StudentClassesManagementClient from './clientPage';

export default function StudentClassesManagementWrapper() {
  const classes = getAllUserClassrooms();
  return (
    <SWRConfig value={{ suspense: true, fallback: { classes } }}>
      <StudentClassesManagementClient />
    </SWRConfig>
  );
}
