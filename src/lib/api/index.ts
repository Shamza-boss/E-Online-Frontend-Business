/**
 * API library exports
 *
 * Barrel file for clean imports:
 * import { Result, ApiError, HttpMethod, ErrorCode } from '@/lib/api';
 */

// Result type for handling success/failure
export { Result } from './result';
export type { Result as ResultType } from './result';

// Error codes and types
export { ErrorCode } from './errors';
export type { ErrorCodeType, ErrorContext } from './errors';

// Error classes
export {
  ApiError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  BadRequestError,
  RateLimitError,
  NetworkError,
  TimeoutError,
} from './errors';

// Type guards and utilities
export {
  isApiError,
  isNetworkError,
  isTimeoutError,
  hasErrorCode,
  getTrackingId,
  formatErrorForLog,
} from './errors';

// User-friendly error messages
export {
  getUserFriendlyError,
  getToastMessage,
  shouldShowFullPage,
} from './userMessages';
export type { UserFriendlyError } from './userMessages';

// Constants and configuration
export {
  PROXY_STRIP_HEADERS,
  MULTIPART_CONTENT_TYPE,
  DEFAULT_TIMEOUT,
  RETRY_CONFIG,
  BODYLESS_METHODS,
  CONTENT_TYPES,
} from './constants';

export type { HttpMethod, BodylessMethod } from './constants';
