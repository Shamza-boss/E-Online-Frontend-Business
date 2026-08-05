/**
 * Canonical SWR cache keys.
 *
 * Keep keys stable and shared so lookups (academics, subjects, etc.)
 * dedupe across features instead of using per-page string literals.
 */

export const swrKeys = {
  academics: 'academics',
  subjects: 'subjects',
  usersInstructors: 'users-instructors',
  settingsMe: 'settings-me',
  repositoryFiles: 'repository-files',
  dashboardSystem: 'dashboard-system',
  dashboardInstitution: 'dashboard-institution',
  dashboardPlatformOwner: 'dashboard-platform-owner',
  dashboardInstructorHome: 'dashboard-instructor-home',
  dashboardTraineeHome: 'dashboard-trainee-home',

  dashboardInsight: (role: string, insight: string) =>
    ['dashboard-insight', role, insight] as const,

  invoicesOverdue: 'invoices-overdue',
  invoiceStatusSummaries: 'invoice-status-summaries',
  institutions: 'institutions',

  dashboardInstitutionBilling: (institutionId: string) =>
    ['dashboard-institution-billing', institutionId] as const,

  institutionBilling: (institutionId: string) =>
    ['institution-billing', institutionId] as const,

  institutionBillingHistory: (institutionId: string) =>
    ['institution-billing-history', institutionId] as const,

  institutionBillingProjection: (
    institutionId: string,
    year?: number,
    month?: number,
  ) =>
    ['institution-billing-projection', institutionId, year, month] as const,

  institutionInvoices: (institutionId: string) =>
    ['institution-invoices', institutionId] as const,

  invoiceDetail: (invoiceId: string) => ['invoice-detail', invoiceId] as const,

  invoiceSummary: (year?: number, month?: number) =>
    ['invoice-summary', year, month] as const,

  classroomNote: (classId: string) => ['classroom-note', classId] as const,

  classroomNotes: (classId: string) => ['classroom-notes', classId] as const,

  institutionVideos: (
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
  ) => ['institution-videos', pageNumber, pageSize, searchTerm] as const,
} as const;
