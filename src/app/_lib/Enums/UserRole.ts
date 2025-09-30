export enum UserRole {
  PlatformAdmin = -1, // Admin of the platform
  Admin = 0, // Admin of an institution
  Student = 1, // Students who belong to classes
  Teacher = 2, // Teachers who own classrooms
  AdmissionsVerifier = 3, // Handles verification of admissions/registrations
  Auditor = 4, // Cross-institution immutable log access
  Moderator = 5, // Oversees institution operations (HOD, grading moderation, admissions, class mgmt)
  Parent = 6, // Parents who oversee student accounts
}
