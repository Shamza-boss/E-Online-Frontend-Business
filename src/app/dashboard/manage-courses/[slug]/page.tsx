import StudentManagementComponent from '../_components/Class';
import {
  getAllUsersInClassroom,
  getClassroomById,
} from '../../../_lib/actions/classrooms';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const name = decoded.split('~')[0] ?? 'Course';

  return {
    title: `Manage ${name}`,
  };
}

export default async function ManageLectures({ params }: PageProps) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const classId = decoded.split('~')[1];
  if (!classId) {
    notFound();
  }

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
