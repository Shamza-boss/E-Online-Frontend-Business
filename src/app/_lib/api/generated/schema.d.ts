/**
 * AUTO-GENERATED — do not edit.
 * Run: npm run generate:api-types
 * Source: C:\Users\shammah.nhlabathi\Documents\E-Online-Backend-Business\contracts\openapi.v1.json
 */

export type paths = {
    "/api/academiclevel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAllAcademicLevels"];
        put?: never;
        post: operations["CreateAcademicLevel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/academiclevel/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAcademicLevelById"];
        put: operations["UpdateAcademicLevel"];
        post?: never;
        delete: operations["DeleteAcademicLevel"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/resolve/{email}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ResolveByEmail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/security-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetSecurityStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/mark-email-verified": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["MarkEmailVerified"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/mark-passkey-enrolled": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["MarkPasskeyEnrolled"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/classrooms": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAllClassrooms"];
        put?: never;
        post: operations["AddClassroom"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/classrooms/details": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAllClassroomsWithDetails"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/classrooms/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetClassroomById"];
        put: operations["UpdateClassroom"];
        post?: never;
        delete: operations["DeleteClassroom"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/classrooms/classUsers/{classroomId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetUsersForClassroom"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/classrooms/EnrollStudents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["EnrollStudents"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/classrooms/UnenrollStudents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["UnenrollStudents"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/classrooms/user/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetUserClassrooms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/dashboard/system": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetSystemAdminDashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/dashboard/institution": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetInstitutionDashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/dashboard/platform-owner": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetPlatformOwnerDashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/dashboard/platform-owner/institution/{institutionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetInstitutionBillingDashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/homework/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["CreateHomework"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/homework/teacher/{teacherId}/module/{homeworkId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetHomeworkForTeacher"];
        put: operations["UpdateHomeworkDraft"];
        post?: never;
        delete: operations["SoftDeleteHomework"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/homework/teacher/{teacherId}/module/{homeworkId}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["PublishHomework"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/homework/teacher/{teacherId}/module/{homeworkId}/unpublish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["UnpublishHomework"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/homework/classroom/{classroomId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetHomeworkByClassroom"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/homework/assignment/{assignmentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAssignmentById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/homework/submit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["SubmitHomework"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/homework/grade": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["GradeHomework"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/homework/student/{studentId}/assignments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAssignmentsForStudent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/homework/teacher/{teacherId}/homeworks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAllHomeworksForTeacher"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/homework/teacher/{teacherId}/student/{studentId}/assignments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAssignmentsByStudentInTeacherClassrooms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/homework/teacher/{teacherId}/classroom/{classroomId}/homeworks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetTeacherClassroomModules"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/homework/assignment/{assignmentId}/reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["ResetAssignment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/institutions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAllInstitutions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/institutions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetInstitutionById"];
        put?: never;
        post?: never;
        delete: operations["DeleteInstitution"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/institutions/{id}/admin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetInstitutionWithAdminById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/institutions/{institutionId}/deactivate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["DeactivateInstitution"];
        trace?: never;
    };
    "/api/institutions/{institutionId}/reactivate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["ReactivateInstitution"];
        trace?: never;
    };
    "/api/institutions/full": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AddInstitutionWithAdmin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/institutions/{institutionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["UpdateInstitutionWithAdmin"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/invoices/{institutionId}/generate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["GenerateInvoice"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/invoices/generate-all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["GenerateAllInvoices"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/invoices/{institutionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetInstitutionInvoices"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/invoices/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAllInvoices"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/invoices/overdue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetOverdueInvoices"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/invoices/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetInvoiceSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/invoices/status-summaries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetInvoiceStatusSummaries"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/invoices/detail/{invoiceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetInvoiceById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/invoices/detail/{invoiceId}/pdf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DownloadInvoicePdf"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/invoices/{invoiceId}/send": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["SendInvoice"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/invoices/{invoiceId}/pay": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["MarkInvoiceAsPaid"];
        trace?: never;
    };
    "/api/invoices/{invoiceId}/unpay": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["MarkInvoiceAsUnpaid"];
        trace?: never;
    };
    "/api/invoices/{invoiceId}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["CancelInvoice"];
        trace?: never;
    };
    "/api/invoices/mark-overdue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["MarkOverdueInvoices"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/invoices/enforce-payment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["EnforcePayment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/notes/{classroomId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetOrCreateNote"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/notes/{noteId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["UpdateNote"];
        post?: never;
        delete: operations["DeleteNote"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/notes/{classroomId}/teacher/notes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetNotesForClassroom"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/settings/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetMySettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/storage/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["UploadFile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/storage/download/{key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DownloadFile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/storage/files": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAllFiles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/storage/files/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetFileById"];
        put?: never;
        post?: never;
        delete: operations["DeleteFile"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/storage/files/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["RegisterFile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/storage/upload-direct": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["UploadFileDirect"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/storage/files/{id}/toggle-public": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["ToggleFilePublicStatus"];
        trace?: never;
    };
    "/api/stream/direct-upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["CreateDirectUpload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/stream/video-meta": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetVideoMetadata"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/stream/sign-playback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["SignPlayback"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/stream/videos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ListInstitutionVideos"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/subjects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAllSubjects"];
        put?: never;
        post: operations["CreateSubject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/subjects/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetSubjectById"];
        put: operations["UpdateSubject"];
        post?: never;
        delete: operations["DeleteSubject"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/subscriptions/{institutionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetInstitutionBilling"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/subscriptions/{institutionId}/creator": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["SetCreatorAddon"];
        trace?: never;
    };
    "/api/subscriptions/{institutionId}/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetBillingHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/subscriptions/{institutionId}/projection": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetMonthProjection"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAllUsers"];
        put?: never;
        post: operations["AddUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/users/students": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetAllStudents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GetUserById"];
        put: operations["UpdateUser"];
        post?: never;
        delete: operations["DeleteUser"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/webhooks/cloudflare-stream": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["CloudflareStreamWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
};
export type webhooks = Record<string, never>;
export type components = {
    schemas: {
        AcademicLevelDto: {
            /** Format: uuid */
            id?: string | null;
            name: string | null;
            country?: string | null;
            educationSystem?: string | null;
        };
        AssignmentDetailsDto: {
            /** Format: uuid */
            assignmentId?: string;
            homework?: components["schemas"]["HomeworkDto"];
            answers?: {
                [key: string]: unknown;
            } | null;
            grading?: {
                [key: string]: components["schemas"]["GradeDetailDto"];
            } | null;
            overallComment?: string | null;
            status?: string | null;
        };
        BillingCostSummary: {
            /** Format: double */
            cloudflareStoredUsd?: number;
            /** Format: double */
            cloudflareDeliveredUsd?: number;
            /** Format: double */
            railwayCpuUsd?: number;
            /** Format: double */
            railwayMemoryUsd?: number;
            /** Format: double */
            railwayVolumeUsd?: number;
            /** Format: double */
            railwayEgressUsd?: number;
            /** Format: double */
            railwayObjectStorageUsd?: number;
            /** Format: double */
            totalUsd?: number;
        };
        BillingProjectionDto: {
            /** Format: int32 */
            year?: number;
            /** Format: int32 */
            month?: number;
            usage?: components["schemas"]["BillingUsageSummary"];
            costsUsd?: components["schemas"]["BillingCostSummary"];
            /** Format: double */
            chargeTotal?: number;
            /** Format: double */
            expectedMargin?: number;
        };
        BillingRateDto: {
            creatorEnabled?: boolean;
        };
        BillingSummaryDto: {
            institutionName?: string | null;
            /** Format: int32 */
            year?: number;
            /** Format: int32 */
            month?: number;
            /** Format: int32 */
            userCount?: number;
            creatorEnabled?: boolean;
            /** Format: double */
            ratePerUserZar?: number;
            /** Format: double */
            creatorAddonPerUserZar?: number;
            /** Format: double */
            totalPrice?: number;
        };
        BillingUsageMetricsDto: {
            /** Format: double */
            storedVideoMinutes?: number;
            /** Format: double */
            deliveredVideoMinutes?: number;
            /** Format: double */
            pdfStorageGb?: number;
            /** Format: int64 */
            pdfDownloads?: number;
            /** Format: double */
            cpuSeconds?: number;
            /** Format: double */
            memoryGbSeconds?: number;
            /** Format: double */
            egressGb?: number;
            /** Format: double */
            cloudflareCostUsd?: number;
            /** Format: double */
            railwayCostUsd?: number;
            /** Format: double */
            totalCostUsd?: number;
        };
        BillingUsageSummary: {
            /** Format: int32 */
            userCount?: number;
            /** Format: double */
            storedVideoMinutes?: number;
            /** Format: double */
            deliveredVideoMinutes?: number;
            /** Format: double */
            pdfStorageGb?: number;
            /** Format: int64 */
            pdfDownloads?: number;
            /** Format: double */
            cpuSeconds?: number;
            /** Format: double */
            memoryGbSeconds?: number;
            /** Format: double */
            volumeGbSeconds?: number;
            /** Format: double */
            egressGb?: number;
            /** Format: double */
            objectStorageGbMonthFraction?: number;
        };
        ClassDto: {
            /** Format: uuid */
            id?: string;
            name: string;
            /** Format: uuid */
            teacherId?: string | null;
            /** Format: uuid */
            academicLevelId: string;
            /** Format: uuid */
            subjectId: string;
            /** @description The R2 key you got back from uploadTextbook(...) */
            textbookKey: string;
            /** @description SHA-256 hash of the PDF (for dedupe lookup). */
            textbookHash: string;
            /** @description (Optional) presigned-GET URL (or you can ignore/re-generate server-side). */
            textbookUrl?: string | null;
            textbookFileName?: string | null;
            /** Format: int64 */
            textbookFileSizeBytes?: number | null;
            textbookPreviewImageKey?: string | null;
            /** Format: date-time */
            textbookUploadedAt?: string | null;
            /** Format: uuid */
            textbookUploadedByUserId?: string | null;
        };
        /** @description Generic wrapper for paginated results */
        ClassDtoPagedResult: {
            /** @description The list of items for the current page */
            items?: components["schemas"]["ClassDto"][] | null;
            /**
             * Format: int32
             * @description Current page number (1-based)
             */
            pageNumber?: number;
            /**
             * Format: int32
             * @description Number of items per page
             */
            pageSize?: number;
            /**
             * Format: int32
             * @description Total number of items across all pages
             */
            totalCount?: number;
            /**
             * Format: int32
             * @description Total number of pages
             */
            readonly totalPages?: number;
            /** @description Indicates if there is a previous page */
            readonly hasPrevious?: boolean;
            /** @description Indicates if there is a next page */
            readonly hasNext?: boolean;
        };
        ClassroomDetailsDto: {
            /** Format: uuid */
            classroomId?: string;
            classroomName?: string | null;
            /** Format: uuid */
            teacherId?: string | null;
            teacherFirstName?: string | null;
            teacherLastName?: string | null;
            /** Format: uuid */
            academicLevelId?: string | null;
            academicLevelName?: string | null;
            /** Format: uuid */
            subjectId?: string | null;
            subjectName?: string | null;
            subjectCode?: string | null;
            /** Format: int32 */
            numberOfUsers?: number;
        };
        /** @description Generic wrapper for paginated results */
        ClassroomDetailsDtoPagedResult: {
            /** @description The list of items for the current page */
            items?: components["schemas"]["ClassroomDetailsDto"][] | null;
            /**
             * Format: int32
             * @description Current page number (1-based)
             */
            pageNumber?: number;
            /**
             * Format: int32
             * @description Number of items per page
             */
            pageSize?: number;
            /**
             * Format: int32
             * @description Total number of items across all pages
             */
            totalCount?: number;
            /**
             * Format: int32
             * @description Total number of pages
             */
            readonly totalPages?: number;
            /** @description Indicates if there is a previous page */
            readonly hasPrevious?: boolean;
            /** @description Indicates if there is a next page */
            readonly hasNext?: boolean;
        };
        CreateUploadDto: {
            filename?: string | null;
            /** Format: int64 */
            size?: number | null;
        };
        EnrollStudentsDto: {
            /** Format: uuid */
            classroomId: string;
            studentIds: string[] | null;
        };
        FileDto: {
            /** Format: uuid */
            id?: string;
            fileKey?: string | null;
            url?: string | null;
            hash?: string | null;
            isPublic?: boolean;
            /** Format: uuid */
            institutionId?: string;
            fileName?: string | null;
            /** Format: int64 */
            fileSizeBytes?: number | null;
            previewImageKey?: string | null;
            previewImageUrl?: string | null;
            /** Format: date-time */
            uploadedAt?: string | null;
            /** Format: uuid */
            uploadedByUserId?: string | null;
        };
        GetUploadUrlResponseDto: {
            key?: string | null;
            uploadUrl?: string | null;
            proxyDownload?: string | null;
            presignedGet?: string | null;
            hash?: string | null;
            fileName?: string | null;
            /** Format: int64 */
            fileSizeBytes?: number | null;
        };
        GradeDetailDto: {
            /** Format: int32 */
            grade?: number;
            comment?: string | null;
        };
        GradeHomeworkDto: {
            /** Format: uuid */
            assignmentId?: string;
            grading?: {
                [key: string]: components["schemas"]["GradeDetailDto"];
            } | null;
            overallComment?: string | null;
            /** Format: date-time */
            gradePublishDate?: string | null;
        };
        GradePerformanceDto: {
            label?: string | null;
            data?: number[] | null;
        };
        GradePerformanceLableTrendDto: {
            /** Format: double */
            average?: number;
            color?: string | null;
        };
        HomeworkAssignmentDto: {
            /** Format: uuid */
            assignmentId?: string;
            /** Format: uuid */
            homeworkId?: string;
            homeworkTitle?: string | null;
            homeworkDescription?: string | null;
            /** Format: date-time */
            dueDate?: string | null;
            isSubmitted?: boolean;
            /** Format: date-time */
            submittedAt?: string | null;
            /** Format: int32 */
            totalScore?: number | null;
            isGraded?: boolean;
            overallComment?: string | null;
            /** Format: uuid */
            classroomId?: string;
            /** Format: double */
            studentScore?: number | null;
            /** Format: double */
            studentTotalWeight?: number | null;
            /** Format: double */
            studentPercentage?: number | null;
            /** Format: int32 */
            attemptNumber?: number;
        };
        HomeworkDto: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            homeworkId?: string;
            /** Format: uuid */
            classroomId?: string;
            title?: string | null;
            description?: string | null;
            /** Format: date-time */
            dueDate?: string;
            isPublished?: boolean;
            hasExpiry?: boolean;
            /** Format: date-time */
            expiryDate?: string | null;
            isExam?: boolean;
            /** Format: date-time */
            scheduledAt?: string | null;
            allowReset?: boolean;
            isActive?: boolean;
            /** Format: int32 */
            completions?: number | null;
            /** Format: int32 */
            totalStudents?: number | null;
            /** Format: double */
            studentScore?: number | null;
            /** Format: double */
            studentTotalWeight?: number | null;
            /** Format: double */
            studentPercentage?: number | null;
            questions?: components["schemas"]["QuestionDto"][] | null;
        };
        HourlyLoginStat: {
            /** Format: int32 */
            hour?: number;
            /** Format: int32 */
            count?: number;
        };
        InstitutionActivitySeries: {
            id?: string | null;
            label?: string | null;
            data?: number[] | null;
        };
        InstitutionBillingDashboardDto: {
            /** Format: uuid */
            institutionId?: string;
            institutionName?: string | null;
            /** Format: int32 */
            userCount?: number;
            /** Format: double */
            ratePerUserZar?: number;
            /** Format: double */
            monthlyRevenueZar?: number;
            usageMetrics?: components["schemas"]["BillingUsageMetricsDto"];
            /** Format: double */
            totalCostZar?: number;
            /** Format: double */
            costPerUserZar?: number;
            /** Format: double */
            projectedMonthlyCostZar?: number;
            /** Format: double */
            profitZar?: number;
            /** Format: double */
            profitMarginPercent?: number;
        };
        InstitutionDto: {
            /** Format: uuid */
            id?: string;
            name: string | null;
            adminEmail?: string | null;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
            isActive?: boolean;
            plan?: components["schemas"]["SubscriptionFeatures"];
            creatorEnabled?: boolean;
        };
        InstitutionTrendDashboardDto: {
            teachers?: components["schemas"]["TrendMetricDto"];
            students?: components["schemas"]["TrendMetricDto"];
            notesCreated?: components["schemas"]["TrendMetricDto"];
            homeworkCreated?: components["schemas"]["TrendMetricDto"];
            gradePerformance?: components["schemas"]["GradePerformanceDto"][] | null;
            gradePerformanceMonths?: string[] | null;
            gradePerformanceTrends?: components["schemas"]["GradePerformanceLableTrendDto"];
            mostActiveSubjects?: components["schemas"]["MostActiveClassSubjectSeriesDto"];
            recentHomeworkStats?: components["schemas"]["RecentHomeworkStatDto"][] | null;
        };
        InstitutionWithAdminDto: {
            institution: components["schemas"]["InstitutionDto"];
            admin: components["schemas"]["NewAdminDto"];
        };
        /** @description Generic wrapper for paginated results */
        InstitutionWithAdminDtoPagedResult: {
            /** @description The list of items for the current page */
            items?: components["schemas"]["InstitutionWithAdminDto"][] | null;
            /**
             * Format: int32
             * @description Current page number (1-based)
             */
            pageNumber?: number;
            /**
             * Format: int32
             * @description Number of items per page
             */
            pageSize?: number;
            /**
             * Format: int32
             * @description Total number of items across all pages
             */
            totalCount?: number;
            /**
             * Format: int32
             * @description Total number of pages
             */
            readonly totalPages?: number;
            /** @description Indicates if there is a previous page */
            readonly hasPrevious?: boolean;
            /** @description Indicates if there is a next page */
            readonly hasNext?: boolean;
        };
        InvoiceDto: {
            /** Format: uuid */
            id?: string;
            /** Format: uuid */
            institutionId?: string;
            institutionName?: string | null;
            invoiceNumber?: string | null;
            /** Format: int32 */
            year?: number;
            /** Format: int32 */
            month?: number;
            /** Format: int32 */
            userCount?: number;
            creatorEnabled?: boolean;
            /** Format: double */
            ratePerUserZar?: number;
            /** Format: double */
            creatorAddonPerUserZar?: number;
            /** Format: double */
            subtotalZar?: number;
            /** Format: double */
            creatorTotalZar?: number;
            /** Format: double */
            totalAmountZar?: number;
            rateTier?: string | null;
            status?: string | null;
            /** Format: date-time */
            issuedAt?: string;
            /** Format: date-time */
            dueDate?: string;
            /** Format: date-time */
            sentAt?: string | null;
            sentToEmail?: string | null;
            /** Format: date-time */
            paidAt?: string | null;
            paymentReference?: string | null;
            notes?: string | null;
            lineItems?: components["schemas"]["InvoiceLineItemDto"][] | null;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
        };
        InvoiceLineItemDto: {
            /** Format: uuid */
            id?: string;
            description?: string | null;
            /** Format: int32 */
            quantity?: number;
            /** Format: double */
            unitPriceZar?: number;
            /** Format: double */
            totalZar?: number;
            lineType?: string | null;
        };
        InvoiceStatusSummaryDto: {
            /** Format: uuid */
            institutionId?: string;
            institutionName?: string | null;
            currentMonthInvoiced?: boolean;
            currentMonthStatus?: string | null;
            /** Format: date-time */
            lastInvoiceDate?: string | null;
            /** Format: date-time */
            lastPaymentDate?: string | null;
            /** Format: int32 */
            overdueCount?: number;
        };
        InvoiceSummaryDto: {
            /** Format: int32 */
            totalInvoices?: number;
            /** Format: int32 */
            paidCount?: number;
            /** Format: int32 */
            unpaidCount?: number;
            /** Format: int32 */
            overdueCount?: number;
            /** Format: double */
            totalBilledZar?: number;
            /** Format: double */
            totalPaidZar?: number;
            /** Format: double */
            totalOutstandingZar?: number;
        };
        LibraryFileDto: {
            /** Format: uuid */
            id?: string;
            fileKey?: string | null;
            url?: string | null;
            hash?: string | null;
            isPublic?: boolean;
            /** Format: uuid */
            institutionId?: string;
            fileName?: string | null;
            /** Format: int64 */
            fileSizeBytes?: number | null;
            previewImageKey?: string | null;
            previewImageUrl?: string | null;
            /** Format: date-time */
            uploadedAt?: string | null;
            /** Format: uuid */
            uploadedByUserId?: string | null;
            linkedClassrooms?: components["schemas"]["LinkedClassroomDto"][] | null;
            /** Format: int32 */
            linkedClassroomCount?: number;
        };
        /** @description Generic wrapper for paginated results */
        LibraryFileDtoPagedResult: {
            /** @description The list of items for the current page */
            items?: components["schemas"]["LibraryFileDto"][] | null;
            /**
             * Format: int32
             * @description Current page number (1-based)
             */
            pageNumber?: number;
            /**
             * Format: int32
             * @description Number of items per page
             */
            pageSize?: number;
            /**
             * Format: int32
             * @description Total number of items across all pages
             */
            totalCount?: number;
            /**
             * Format: int32
             * @description Total number of pages
             */
            readonly totalPages?: number;
            /** @description Indicates if there is a previous page */
            readonly hasPrevious?: boolean;
            /** @description Indicates if there is a next page */
            readonly hasNext?: boolean;
        };
        LinkedClassroomDto: {
            /** Format: uuid */
            id?: string;
            name?: string | null;
            academicLevelName?: string | null;
            /** Format: uuid */
            academicLevelId?: string | null;
            subjectName?: string | null;
        };
        MarkInvoicePaidDto: {
            paymentReference?: string | null;
            notes?: string | null;
        };
        MostActiveClassSubjectSeriesDto: {
            labels?: string[] | null;
            series?: components["schemas"]["SubjectSeries"][] | null;
        };
        MostActiveInstitutionSeriesDto: {
            labels?: string[] | null;
            series?: components["schemas"]["InstitutionActivitySeries"][] | null;
        };
        NewAdminDto: {
            /** Format: uuid */
            id?: string | null;
            firstName?: string | null;
            lastName?: string | null;
            email?: string | null;
            isPrimaryAdmin?: boolean;
        };
        NoteDto: {
            /** Format: uuid */
            id?: string;
            title?: string | null;
            content?: string | null;
            /** Format: date-time */
            noteDate?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: uuid */
            classroomId?: string;
            /** Format: uuid */
            userId?: string;
        };
        PdfMetaDto: {
            provider?: string | null;
            key?: string | null;
            url?: string | null;
            hash?: string | null;
            /** Format: int64 */
            sizeBytes?: number | null;
            title?: string | null;
        };
        PlatformOwnerDashboardDto: {
            institutions?: components["schemas"]["TrendMetricDto"];
            users?: components["schemas"]["TrendMetricDto"];
            modules?: components["schemas"]["TrendMetricDto"];
            totalCost?: components["schemas"]["TrendMetricDto"];
            averageProfit?: components["schemas"]["TrendMetricDto"];
            mostActiveInstitutions?: components["schemas"]["MostActiveInstitutionSeriesDto"];
            profitMarginPerformance?: components["schemas"]["GradePerformanceDto"][] | null;
            profitMarginMonths?: string[] | null;
            profitMarginTrends?: components["schemas"]["GradePerformanceLableTrendDto"];
        };
        ProblemDetails: {
            type?: string | null;
            title?: string | null;
            /** Format: int32 */
            status?: number | null;
            detail?: string | null;
            instance?: string | null;
        } & {
            [key: string]: unknown;
        };
        QuestionDto: {
            /** Format: uuid */
            id?: string;
            questionText?: string | null;
            type?: string | null;
            options?: string[] | null;
            required?: boolean;
            /** Format: int32 */
            weight?: number;
            video?: components["schemas"]["VideoMetaDto"];
            pdf?: components["schemas"]["PdfMetaDto"];
            subquestions?: components["schemas"]["QuestionDto"][] | null;
            correctAnswer?: string | null;
            correctAnswers?: string[] | null;
        };
        RecentHomeworkStatDto: {
            /** Format: uuid */
            id?: string;
            classroomName?: string | null;
            subjectCode?: string | null;
            homeworkTitle?: string | null;
            /** Format: date-time */
            dueDate?: string;
            /** Format: int32 */
            studentsAssigned?: number;
            /** Format: int32 */
            submissions?: number;
            /** Format: double */
            submissionRate?: number;
            /** Format: double */
            averageGrade?: number;
        };
        SendInvoiceDto: {
            recipientEmail?: string | null;
        };
        SettingsResponseDto: {
            user?: components["schemas"]["UserReadDto"];
            stats?: components["schemas"]["SettingsStatsDto"];
        };
        SettingsStatsDto: {
            explanation?: string | null;
            rating?: string | null;
            kpIs?: {
                [key: string]: number;
            } | null;
            graphs?: components["schemas"]["StatsGraphDto"][] | null;
            extra?: {
                [key: string]: unknown;
            } | null;
        };
        StatsGraphDto: {
            id?: string | null;
            title?: string | null;
            x?: string[] | null;
            series?: components["schemas"]["StatsGraphSeriesDto"][] | null;
            description?: string | null;
        };
        StatsGraphSeriesDto: {
            name?: string | null;
            values?: number[] | null;
        };
        SubjectDto: {
            /** Format: uuid */
            id?: string | null;
            name: string | null;
            group?: string | null;
            subjectCode?: string | null;
            category?: string | null;
        };
        SubjectSeries: {
            id?: string | null;
            label?: string | null;
            data?: number[] | null;
        };
        SubmitHomeworkDto: {
            /** Format: uuid */
            assignmentId?: string;
            answers?: {
                [key: string]: unknown;
            } | null;
            /** Format: date-time */
            submittedAt?: string;
        };
        /**
         * Format: int32
         * @description Flags enum for subscription plan and add-ons.
         *     Plans:
         *     - Standard: Max Users 500.
         *     - Enterprise: Max Users 1500; R100 per user above cap.
         *     Add-ons:
         *     - Creator: Base price R450 per 1000 minutes (R200 stored + R250 streamed).
         *       If thresholds are exceeded in either stored or streamed minutes, billing auto-crosses to the higher tier.
         * @enum {integer}
         */
        SubscriptionFeatures: 0 | 1 | 2 | 16;
        SystemAdminDashboardDto: {
            /** Format: int32 */
            totalInstitutions?: number;
            /** Format: int32 */
            activeInstitutions?: number;
            /** Format: int32 */
            totalUsers?: number;
            /** Format: int32 */
            teachers?: number;
            /** Format: int32 */
            students?: number;
            /** Format: int32 */
            notesCreated?: number;
            /** Format: int32 */
            homeworkCreated?: number;
            /** Format: int32 */
            totalClassrooms?: number;
            peakUsageHours?: components["schemas"]["HourlyLoginStat"][] | null;
        };
        TrendMetricDto: {
            /** Format: int32 */
            total?: number;
            trend?: string | null;
            dataPoints?: number[] | null;
        };
        UpdateClassroomDto: {
            /** Format: uuid */
            id: string;
            name: string;
            /** Format: uuid */
            teacherId?: string | null;
            /** Format: uuid */
            academicLevelId: string;
            /** Format: uuid */
            subjectId: string;
            /** @description The R2 key you got back from uploadTextbook(...) */
            textbookKey: string;
            /** @description SHA-256 hash of the PDF (for dedupe lookup). */
            textbookHash: string;
            /** @description (Optional) presigned-GET URL (or you can ignore/re-generate server-side). */
            textbookUrl?: string | null;
            textbookFileName?: string | null;
            /** Format: int64 */
            textbookFileSizeBytes?: number | null;
            textbookPreviewImageKey?: string | null;
            /** Format: date-time */
            textbookUploadedAt?: string | null;
            /** Format: uuid */
            textbookUploadedByUserId?: string | null;
        };
        UserDto: {
            /** Format: uuid */
            userId?: string;
            /** Format: uuid */
            institutionId?: string | null;
            institutionName?: string | null;
            isInstitutionActive?: boolean;
            primaryAdminEmail?: string | null;
            firstName: string | null;
            lastName: string | null;
            email: string | null;
            role: components["schemas"]["UserRole"];
            subscription?: components["schemas"]["SubscriptionFeatures"];
            subscriptionLabel?: string | null;
            subscriptionPlan?: string | null;
            creatorEnabled?: boolean;
        };
        UserReadDto: {
            /** Format: uuid */
            userId?: string;
            email?: string | null;
            firstName?: string | null;
            lastName?: string | null;
            role?: components["schemas"]["UserRole"];
            /** Format: uuid */
            institutionId?: string | null;
            institutionName?: string | null;
            status?: components["schemas"]["UserStatus"];
            /** Format: date-time */
            emailVerifiedAt?: string | null;
            /** Format: date-time */
            passkeyEnrolledAt?: string | null;
            /** Format: date-time */
            firstLoginAt?: string | null;
            /** Format: date-time */
            enrollmentCompletedAt?: string | null;
            /** Format: date-time */
            createdAt?: string;
            /** Format: uuid */
            createdByUserId?: string | null;
        };
        /** @description Generic wrapper for paginated results */
        UserReadDtoPagedResult: {
            /** @description The list of items for the current page */
            items?: components["schemas"]["UserReadDto"][] | null;
            /**
             * Format: int32
             * @description Current page number (1-based)
             */
            pageNumber?: number;
            /**
             * Format: int32
             * @description Number of items per page
             */
            pageSize?: number;
            /**
             * Format: int32
             * @description Total number of items across all pages
             */
            totalCount?: number;
            /**
             * Format: int32
             * @description Total number of pages
             */
            readonly totalPages?: number;
            /** @description Indicates if there is a previous page */
            readonly hasPrevious?: boolean;
            /** @description Indicates if there is a next page */
            readonly hasNext?: boolean;
        };
        /**
         * Format: int32
         * @enum {integer}
         */
        UserRole: 0 | 1 | 2 | 3 | 4 | 5 | -1;
        UserSecurityStatusDto: {
            status?: components["schemas"]["UserStatus"];
            emailVerified?: boolean;
            passkeyEnrolled?: boolean;
            enrollmentCompleted?: boolean;
            /** Format: date-time */
            firstLoginAt?: string | null;
        };
        /**
         * Format: int32
         * @enum {integer}
         */
        UserStatus: 0 | 1 | 2;
        VideoMetaDto: {
            provider?: string | null;
            uid?: string | null;
            playbackId?: string | null;
            status?: string | null;
            posterUrl?: string | null;
            /** Format: int32 */
            durationSeconds?: number | null;
            /** Format: int64 */
            sizeBytes?: number | null;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
};
export type $defs = Record<string, never>;
export interface operations {
    GetAllAcademicLevels: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AcademicLevelDto"][];
                };
            };
        };
    };
    CreateAcademicLevel: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["AcademicLevelDto"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AcademicLevelDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    GetAcademicLevelById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AcademicLevelDto"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UpdateAcademicLevel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AcademicLevelDto"];
            };
        };
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    DeleteAcademicLevel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ResolveByEmail: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                email: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserDto"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetSecurityStatus: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserSecurityStatusDto"];
                };
            };
        };
    };
    MarkEmailVerified: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    MarkPasskeyEnrolled: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetAllClassrooms: {
        parameters: {
            query?: {
                pageNumber?: number;
                pageSize?: number;
                searchTerm?: string;
                sortBy?: string;
                sortDirection?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClassDtoPagedResult"];
                };
            };
        };
    };
    AddClassroom: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ClassDto"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClassDto"];
                };
            };
        };
    };
    GetAllClassroomsWithDetails: {
        parameters: {
            query?: {
                pageNumber?: number;
                pageSize?: number;
                searchTerm?: string;
                sortBy?: string;
                sortDirection?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClassroomDetailsDtoPagedResult"];
                };
            };
        };
    };
    GetClassroomById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClassDto"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UpdateClassroom: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateClassroomDto"];
            };
        };
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    DeleteClassroom: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetUsersForClassroom: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                classroomId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserDto"][];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    EnrollStudents: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EnrollStudentsDto"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EnrollStudentsDto"];
                };
            };
        };
    };
    UnenrollStudents: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EnrollStudentsDto"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EnrollStudentsDto"];
                };
            };
        };
    };
    GetUserClassrooms: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClassroomDetailsDto"][];
                };
            };
        };
    };
    GetSystemAdminDashboard: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SystemAdminDashboardDto"];
                };
            };
        };
    };
    GetInstitutionDashboard: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InstitutionTrendDashboardDto"];
                };
            };
        };
    };
    GetPlatformOwnerDashboard: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlatformOwnerDashboardDto"];
                };
            };
        };
    };
    GetInstitutionBillingDashboard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                institutionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InstitutionBillingDashboardDto"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    CreateHomework: {
        parameters: {
            query: {
                teacherId: string;
                classroomId: string;
                isDraft: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["HomeworkDto"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetHomeworkForTeacher: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                teacherId: string;
                homeworkId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HomeworkDto"];
                };
            };
        };
    };
    UpdateHomeworkDraft: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                teacherId: string;
                homeworkId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["HomeworkDto"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    SoftDeleteHomework: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                teacherId: string;
                homeworkId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PublishHomework: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                teacherId: string;
                homeworkId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    UnpublishHomework: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                teacherId: string;
                homeworkId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    GetHomeworkByClassroom: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                classroomId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetAssignmentById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                assignmentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssignmentDetailsDto"];
                };
            };
        };
    };
    SubmitHomework: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubmitHomeworkDto"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeHomework: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GradeHomeworkDto"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetAssignmentsForStudent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HomeworkAssignmentDto"][];
                };
            };
        };
    };
    GetAllHomeworksForTeacher: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                teacherId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HomeworkDto"][];
                };
            };
        };
    };
    GetAssignmentsByStudentInTeacherClassrooms: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                teacherId: string;
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HomeworkAssignmentDto"][];
                };
            };
        };
    };
    GetTeacherClassroomModules: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                teacherId: string;
                classroomId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HomeworkDto"][];
                };
            };
        };
    };
    ResetAssignment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                assignmentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetAllInstitutions: {
        parameters: {
            query?: {
                pageNumber?: number;
                pageSize?: number;
                searchTerm?: string;
                sortBy?: string;
                sortDirection?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InstitutionWithAdminDtoPagedResult"];
                };
            };
        };
    };
    GetInstitutionById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InstitutionDto"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    DeleteInstitution: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetInstitutionWithAdminById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InstitutionWithAdminDto"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    DeactivateInstitution: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                institutionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReactivateInstitution: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                institutionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AddInstitutionWithAdmin: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InstitutionWithAdminDto"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UpdateInstitutionWithAdmin: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                institutionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InstitutionWithAdminDto"];
            };
        };
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    GenerateInvoice: {
        parameters: {
            query?: {
                year?: number;
                month?: number;
            };
            header?: never;
            path: {
                institutionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    GenerateAllInvoices: {
        parameters: {
            query?: {
                year?: number;
                month?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceDto"][];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    GetInstitutionInvoices: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                institutionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceDto"][];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    GetAllInvoices: {
        parameters: {
            query?: {
                year?: number;
                month?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceDto"][];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    GetOverdueInvoices: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceDto"][];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    GetInvoiceSummary: {
        parameters: {
            query?: {
                year?: number;
                month?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceSummaryDto"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    GetInvoiceStatusSummaries: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceStatusSummaryDto"][];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    GetInvoiceById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                invoiceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceDto"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    DownloadInvoicePdf: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                invoiceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetails"];
                };
            };
        };
    };
    SendInvoice: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                invoiceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SendInvoiceDto"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    MarkInvoiceAsPaid: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                invoiceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MarkInvoicePaidDto"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    MarkInvoiceAsUnpaid: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                invoiceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    CancelInvoice: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                invoiceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    MarkOverdueInvoices: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    EnforcePayment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string[];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    GetOrCreateNote: {
        parameters: {
            query: {
                userId: string;
            };
            header?: never;
            path: {
                classroomId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NoteDto"];
                };
            };
        };
    };
    UpdateNote: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                noteId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NoteDto"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NoteDto"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    DeleteNote: {
        parameters: {
            query: {
                userId: string;
            };
            header?: never;
            path: {
                noteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    GetNotesForClassroom: {
        parameters: {
            query: {
                teacherId: string;
            };
            header?: never;
            path: {
                classroomId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NoteDto"][];
                };
            };
        };
    };
    GetMySettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SettingsResponseDto"];
                };
            };
        };
    };
    UploadFile: {
        parameters: {
            query?: {
                hash?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    file: string;
                };
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GetUploadUrlResponseDto"];
                };
            };
        };
    };
    DownloadFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetAllFiles: {
        parameters: {
            query?: {
                pageNumber?: number;
                pageSize?: number;
                searchTerm?: string;
                sortBy?: string;
                sortDirection?: string;
                academicLevelId?: string;
                classroomId?: string;
                isPublic?: boolean;
                unlinkedOnly?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LibraryFileDtoPagedResult"];
                };
            };
        };
    };
    GetFileById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LibraryFileDto"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    DeleteFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    RegisterFile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FileDto"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FileDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    UploadFileDirect: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    file: string;
                };
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FileDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    ToggleFilePublicStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CreateDirectUpload: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateUploadDto"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetVideoMetadata: {
        parameters: {
            query?: {
                uid?: string;
                refresh?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SignPlayback: {
        parameters: {
            query?: {
                uid?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ListInstitutionVideos: {
        parameters: {
            query?: {
                searchTerm?: string;
                pageNumber?: number;
                pageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetAllSubjects: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubjectDto"][];
                };
            };
        };
    };
    CreateSubject: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["SubjectDto"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubjectDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    GetSubjectById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubjectDto"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UpdateSubject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubjectDto"];
            };
        };
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    DeleteSubject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetInstitutionBilling: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                institutionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BillingSummaryDto"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SetCreatorAddon: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                institutionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BillingRateDto"];
            };
        };
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetBillingHistory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                institutionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BillingSummaryDto"][];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetMonthProjection: {
        parameters: {
            query?: {
                year?: number;
                month?: number;
            };
            header?: never;
            path: {
                institutionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BillingProjectionDto"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GetAllUsers: {
        parameters: {
            query?: {
                pageNumber?: number;
                pageSize?: number;
                searchTerm?: string;
                sortBy?: string;
                sortDirection?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserReadDtoPagedResult"];
                };
            };
        };
    };
    AddUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserDto"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserReadDto"];
                };
            };
        };
    };
    GetAllStudents: {
        parameters: {
            query?: {
                pageNumber?: number;
                pageSize?: number;
                searchTerm?: string;
                sortBy?: string;
                sortDirection?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserReadDtoPagedResult"];
                };
            };
        };
    };
    GetUserById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserReadDto"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UpdateUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserDto"];
            };
        };
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    DeleteUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CloudflareStreamWebhook: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": unknown;
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
