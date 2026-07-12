import React from 'react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClassComponent } from '../_components/Class';
import { getClassroomById } from '@/app/_lib/actions/classrooms';

type PageProps = {
  params: Promise<{ slug: string }>;
}
// Optional: set dynamic title using className if passed
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const name = decoded.split('~')[0] ?? 'Course';

  return {
    title: name,
  };
}

const Lectures = async ({ params }: PageProps) => {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const classId = decoded.split('~')[1];
  if (!classId) {
    notFound();
  }
  const classroom = await getClassroomById(classId);
  return (
    <ClassComponent classId={classId} textbookUrl={classroom.textbookUrl} />
  );
};

export default Lectures;
