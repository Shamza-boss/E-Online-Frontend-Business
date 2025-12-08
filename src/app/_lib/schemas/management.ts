import { UserRole } from '../Enums/UserRole';
import { z } from 'zod';

export const subscriptionPlanSchema = z.enum(['Standard', 'Enterprise']);

const checkboxBooleanSchema = z.preprocess((value) => {
  if (value === 'on' || value === 'true' || value === '1') {
    return true;
  }

  if (value === 'false' || value === '0') {
    return false;
  }

  return false;
}, z.boolean());

export const classroomSchema = z.object({
  name: z.string().nonempty('Class name is required'),
  teacherId: z.string().nonempty('Instructor is required'),
  academicLevelId: z.string().nonempty('Grade level is required'),
  subjectId: z.string().nonempty('Subject is required'),
});

export const registrationSchema = z.object({
  firstName: z.string().min(2).max(20).nonempty('First name is required'),
  lastName: z.string().min(2).max(20).nonempty('Last name is required'),
  email: z.string().email('Invalid email format').nonempty('Email is required'),
  role: z
    .enum([
      String(UserRole.Admin),
      String(UserRole.Trainee),
      String(UserRole.Instructor),
    ])
    .transform(Number), // Transform the string to a number
});

export const subjectsSchema = z.object({
  name: z.string().min(2).max(20).nonempty('Subject name is required'),
  group: z.string().min(2).max(20).nonempty('Group name is required'),
  subjectCode: z.string().min(2).max(20).nonempty('Subject code is required'),
  category: z.string().min(2).max(20),
});

export const academicsSchema = z.object({
  name: z.string().min(2).max(20).nonempty('Academics name is required'),
  country: z.string().min(2).max(20).nonempty('Country name is required'),
  educationSystem: z.string().min(2).max(20),
});

export const institutionSchema = z.object({
  institutionName: z
    .string()
    .min(2)
    .max(100)
    .nonempty('Institution name is required'),
  adminFirstName: z
    .string()
    .min(2)
    .max(50)
    .nonempty('Admin first name is required'),
  adminLastName: z
    .string()
    .min(2)
    .max(50)
    .nonempty('Admin last name is required'),
  adminEmail: z
    .string()
    .email('Invalid email format')
    .nonempty('Admin email is required'),
  subscriptionPlan: subscriptionPlanSchema,
  creatorEnabled: checkboxBooleanSchema,
});
