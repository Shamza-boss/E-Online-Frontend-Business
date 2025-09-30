import StudentManagementComponent from '../_components/Class';
import {
  getAllUsersInClassroom,
  getClassroomById,
} from '../../../_lib/actions/classroom';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}
// Optional: set dynamic title using className if passed
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const [name] = decoded.split('~');

  return {
    title: `Manage ${name}`,
  };
}

export default async function ManageLectures({ params }: PageProps) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const [, classId] = decoded.split('~');

  const [classUsers, classDetails] = await Promise.all([
    getAllUsersInClassroom(classId),
    getClassroomById(classId),
  ]);

  return (
    <StudentManagementComponent
      userData={classUsers}
      classDetails={classDetails}
    />
  );
}
