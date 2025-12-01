/**
 * User-Friendly Error Messages
 *
 * Maps error codes to user-friendly messages that are:
 * - Informative but not revealing internal details
 * - Actionable where possible
 * - Consistent in tone
 */

import { ErrorCode, type ErrorCodeType } from '@/lib/api';

export interface UserFriendlyError {
  /** Short title for the error */
  title: string;
  /** Longer description with context */
  description: string;
  /** Suggested action for the user */
  action?: string;
  /** Whether this is recoverable (show retry) */
  recoverable: boolean;
  /** Severity level for UI display */
  severity: 'error' | 'warning' | 'info';
}

/**
 * Map of error codes to user-friendly messages
 */
const ERROR_MESSAGES: Record<ErrorCodeType, UserFriendlyError> = {
  // Authentication & Authorization
  [ErrorCode.UNAUTHORIZED]: {
    title: 'Session Expired',
    description: 'Your session has expired. Please sign in again to continue.',
    action: 'Sign in',
    recoverable: true,
    severity: 'warning',
  },
  [ErrorCode.FORBIDDEN]: {
    title: 'Access Denied',
    description: "You don't have permission to access this resource.",
    action: 'Go back',
    recoverable: false,
    severity: 'warning',
  },
  [ErrorCode.SESSION_EXPIRED]: {
    title: 'Session Expired',
    description:
      'Your session has timed out for security. Please sign in again.',
    action: 'Sign in',
    recoverable: true,
    severity: 'warning',
  },
  [ErrorCode.INVALID_TOKEN]: {
    title: 'Authentication Error',
    description:
      'There was a problem with your authentication. Please sign in again.',
    action: 'Sign in',
    recoverable: true,
    severity: 'error',
  },

  // Resource Errors
  [ErrorCode.NOT_FOUND]: {
    title: 'Not Found',
    description:
      "The item you're looking for doesn't exist or has been removed.",
    recoverable: false,
    severity: 'info',
  },
  [ErrorCode.ALREADY_EXISTS]: {
    title: 'Already Exists',
    description: 'An item with this information already exists.',
    recoverable: true,
    severity: 'warning',
  },
  [ErrorCode.RESOURCE_LOCKED]: {
    title: 'Resource Busy',
    description:
      'This item is currently being edited by someone else. Please try again later.',
    action: 'Retry',
    recoverable: true,
    severity: 'warning',
  },

  // Validation Errors
  [ErrorCode.VALIDATION_FAILED]: {
    title: 'Validation Error',
    description: 'Please check your input and try again.',
    recoverable: true,
    severity: 'warning',
  },
  [ErrorCode.INVALID_INPUT]: {
    title: 'Invalid Input',
    description: 'Some of the information provided is invalid.',
    recoverable: true,
    severity: 'warning',
  },
  [ErrorCode.MISSING_REQUIRED_FIELD]: {
    title: 'Missing Information',
    description: 'Please fill in all required fields.',
    recoverable: true,
    severity: 'warning',
  },

  // Network & Connection
  [ErrorCode.NETWORK_ERROR]: {
    title: 'Connection Error',
    description:
      'Unable to connect to the server. Please check your internet connection.',
    action: 'Retry',
    recoverable: true,
    severity: 'error',
  },
  [ErrorCode.TIMEOUT]: {
    title: 'Request Timeout',
    description: 'The request took too long to complete. Please try again.',
    action: 'Retry',
    recoverable: true,
    severity: 'warning',
  },
  [ErrorCode.CONNECTION_REFUSED]: {
    title: 'Service Unavailable',
    description:
      'The service is temporarily unavailable. Please try again later.',
    action: 'Retry',
    recoverable: true,
    severity: 'error',
  },
  [ErrorCode.DNS_RESOLUTION_FAILED]: {
    title: 'Connection Error',
    description: 'Unable to reach the server. Please check your connection.',
    action: 'Retry',
    recoverable: true,
    severity: 'error',
  },

  // Server Errors
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    title: 'Something Went Wrong',
    description:
      "We're experiencing technical difficulties. Our team has been notified.",
    action: 'Retry',
    recoverable: true,
    severity: 'error',
  },
  [ErrorCode.SERVICE_UNAVAILABLE]: {
    title: 'Service Unavailable',
    description:
      "We're performing maintenance. Please try again in a few minutes.",
    action: 'Retry',
    recoverable: true,
    severity: 'warning',
  },
  [ErrorCode.BAD_GATEWAY]: {
    title: 'Service Error',
    description:
      "We're having trouble connecting to our services. Please try again.",
    action: 'Retry',
    recoverable: true,
    severity: 'error',
  },
  [ErrorCode.GATEWAY_TIMEOUT]: {
    title: 'Service Timeout',
    description:
      'The service is taking longer than expected. Please try again.',
    action: 'Retry',
    recoverable: true,
    severity: 'warning',
  },

  // Client Errors
  [ErrorCode.BAD_REQUEST]: {
    title: 'Invalid Request',
    description: 'There was a problem with your request. Please try again.',
    recoverable: true,
    severity: 'warning',
  },
  [ErrorCode.RATE_LIMITED]: {
    title: 'Too Many Requests',
    description:
      "You've made too many requests. Please wait a moment before trying again.",
    action: 'Wait and retry',
    recoverable: true,
    severity: 'warning',
  },
  [ErrorCode.PAYLOAD_TOO_LARGE]: {
    title: 'File Too Large',
    description: 'The file you are trying to upload is too large.',
    recoverable: true,
    severity: 'warning',
  },

  // Unknown
  [ErrorCode.UNKNOWN]: {
    title: 'Unexpected Error',
    description:
      'Something unexpected happened. Please try again or contact support.',
    action: 'Retry',
    recoverable: true,
    severity: 'error',
  },
};

/**
 * Get user-friendly error message for an error code
 */
export function getUserFriendlyError(code: ErrorCodeType): UserFriendlyError {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ErrorCode.UNKNOWN];
}

/**
 * Get a simple message for toast/snackbar display
 */
export function getToastMessage(code: ErrorCodeType): string {
  const error = getUserFriendlyError(code);
  return error.description;
}

/**
 * Determine if error should show full page or toast
 */
export function shouldShowFullPage(code: ErrorCodeType): boolean {
  const fullPageErrors: ErrorCodeType[] = [
    ErrorCode.UNAUTHORIZED,
    ErrorCode.FORBIDDEN,
    ErrorCode.NOT_FOUND,
    ErrorCode.INTERNAL_SERVER_ERROR,
    ErrorCode.SERVICE_UNAVAILABLE,
  ];
  return fullPageErrors.includes(code);
}
