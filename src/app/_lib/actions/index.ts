/**
 * Server Actions barrel export
 *
 * Import actions with cleaner paths:
 * import { createClassroom, getClassroomById } from '@/actions';
 */

// Academics
export * from './academics';

// Classrooms
export {
  createClassroom,
  EnrollStudents,
  getAllClassrooms,
  getAllClassroomsAndData,
  getClassroomsAndData,
  getAllUserClassrooms,
  getAllUsersInClassroom,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
} from './classrooms';

// Classrooms (Client-safe)
export * from './classrooms.client';

// Dashboard
export * from './dashboard';

// Homework
export * from './homework';

// Homework (Client-safe)
export * from './homework.client';

// Settings
export * from './settings';

// Settings (Client-safe)
export * from './settings.client';

// Users (Client-safe)
export * from './users.client';

// Institutions
export * from './institutions';

// Notes
export * from './notes';

// Settings
export * from './settings';

// Storage
export * from './storage';

// Stream
export * from './stream';

// Subjects
export * from './subjects';

// Users
export * from './users';
