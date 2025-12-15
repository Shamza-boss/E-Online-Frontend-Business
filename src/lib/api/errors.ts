/**
 * Custom API Error Classes
 *
 * Provides structured error handling with:
 * - Unique error codes for easy debugging
 * - Tracking IDs for log correlation
 * - Rich context for troubleshooting
 * - Type guards for error handling
 */

// ============================================================================
// Error Codes - Use these to quickly identify error types in logs
// ============================================================================

export const ErrorCode = {
  // Authentication & Authorization (1xxx)
  UNAUTHORIZED: 'ERR_1001',
  FORBIDDEN: 'ERR_1002',
  SESSION_EXPIRED: 'ERR_1003',
  INVALID_TOKEN: 'ERR_1004',

  // Resource Errors (2xxx)
  NOT_FOUND: 'ERR_2001',
  ALREADY_EXISTS: 'ERR_2002',
  RESOURCE_LOCKED: 'ERR_2003',

  // Validation Errors (3xxx)
  VALIDATION_FAILED: 'ERR_3001',
  INVALID_INPUT: 'ERR_3002',
  MISSING_REQUIRED_FIELD: 'ERR_3003',

  // Network & Connection (4xxx)
  NETWORK_ERROR: 'ERR_4001',
  TIMEOUT: 'ERR_4002',
  CONNECTION_REFUSED: 'ERR_4003',
  DNS_RESOLUTION_FAILED: 'ERR_4004',

  // Server Errors (5xxx)
  INTERNAL_SERVER_ERROR: 'ERR_5001',
  SERVICE_UNAVAILABLE: 'ERR_5002',
  BAD_GATEWAY: 'ERR_5003',
  GATEWAY_TIMEOUT: 'ERR_5004',

  // Client Errors (6xxx)
  BAD_REQUEST: 'ERR_6001',
  RATE_LIMITED: 'ERR_6002',
  PAYLOAD_TOO_LARGE: 'ERR_6003',

  // Unknown
  UNKNOWN: 'ERR_9999',
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

// ============================================================================
// Error Context - Additional debugging information
// ============================================================================

export interface ErrorContext {
  /** Unique tracking ID for log correlation */
  trackingId: string;
  /** ISO timestamp when error occurred */
  timestamp: string;
  /** Original request URL if available */
  url?: string;
  /** HTTP method if applicable */
  method?: string;
  /** Request/response headers (sanitized) */
  headers?: Record<string, string>;
  /** Additional context data */
  metadata?: Record<string, unknown>;
}

/**
 * Generate a unique tracking ID for error correlation
 */
function generateTrackingId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`.toUpperCase();
}

/**
 * Create error context with tracking information
 */
function createErrorContext(
  partial?: Partial<Omit<ErrorContext, 'trackingId' | 'timestamp'>>
): ErrorContext {
  return {
    trackingId: generateTrackingId(),
    timestamp: new Date().toISOString(),
    ...partial,
  };
}

// ============================================================================
// Base API Error
// ============================================================================

export class ApiError extends Error {
  public readonly context: ErrorContext;

  constructor(
    message: string,
    public readonly status: number,
    public readonly code: ErrorCodeType = ErrorCode.UNKNOWN,
    contextOrDetails?: Partial<ErrorContext> | unknown
  ) {
    super(message);
    this.name = 'ApiError';

    // Handle both new context format and legacy details
    if (
      contextOrDetails &&
      typeof contextOrDetails === 'object' &&
      'trackingId' in contextOrDetails
    ) {
      this.context = contextOrDetails as ErrorContext;
    } else {
      this.context = createErrorContext(
        contextOrDetails
          ? { metadata: { details: contextOrDetails } }
          : undefined
      );
    }

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Create an ApiError from a fetch Response
   */
  static async fromResponse(
    response: Response,
    options?: { method?: string }
  ): Promise<ApiError> {
    const body = await response.text().catch(() => '');
    const code = mapStatusToErrorCode(response.status);

    return new ApiError(
      body || response.statusText || 'Request failed',
      response.status,
      code,
      {
        trackingId: generateTrackingId(),
        timestamp: new Date().toISOString(),
        url: response.url,
        method: options?.method,
      }
    );
  }

  /**
   * Check if error matches a specific HTTP status
   */
  is(status: number): boolean {
    return this.status === status;
  }

  /**
   * Check if error is a client error (4xx)
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Check if error is a server error (5xx)
   */
  isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * Get a debug-friendly string representation
   */
  toDebugString(): string {
    return [
      `[${this.code}] ${this.name}: ${this.message}`,
      `  Status: ${this.status}`,
      `  Tracking ID: ${this.context.trackingId}`,
      `  Timestamp: ${this.context.timestamp}`,
      this.context.url ? `  URL: ${this.context.url}` : null,
      this.context.method ? `  Method: ${this.context.method}` : null,
      this.context.metadata
        ? `  Metadata: ${JSON.stringify(this.context.metadata)}`
        : null,
    ]
      .filter(Boolean)
      .join('\n');
  }

  /**
   * Get a JSON representation for logging
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      context: this.context,
      stack: this.stack,
    };
  }
}

// ============================================================================
// Specific Error Classes
// ============================================================================

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', context?: Partial<ErrorContext>) {
    super(message, 401, ErrorCode.UNAUTHORIZED, context);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', context?: Partial<ErrorContext>) {
    super(message, 403, ErrorCode.FORBIDDEN, context);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not found', context?: Partial<ErrorContext>) {
    super(message, 404, ErrorCode.NOT_FOUND, context);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  constructor(
    message = 'Validation failed',
    public readonly fields?: Record<string, string[]>,
    context?: Partial<ErrorContext>
  ) {
    super(message, 422, ErrorCode.VALIDATION_FAILED, {
      ...context,
      metadata: { ...context?.metadata, fields },
    });
    this.name = 'ValidationError';
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad request', context?: Partial<ErrorContext>) {
    super(message, 400, ErrorCode.BAD_REQUEST, context);
    this.name = 'BadRequestError';
  }
}

export class RateLimitError extends ApiError {
  constructor(
    message = 'Too many requests',
    public readonly retryAfter?: number,
    context?: Partial<ErrorContext>
  ) {
    super(message, 429, ErrorCode.RATE_LIMITED, {
      ...context,
      metadata: { ...context?.metadata, retryAfter },
    });
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends Error {
  public readonly code = ErrorCode.NETWORK_ERROR;
  public readonly context: ErrorContext;

  constructor(message = 'Network error', cause?: unknown) {
    super(message);
    this.name = 'NetworkError';
    this.cause = cause;
    this.context = createErrorContext({
      metadata: cause ? { originalError: String(cause) } : undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toDebugString(): string {
    return [
      `[${this.code}] ${this.name}: ${this.message}`,
      `  Tracking ID: ${this.context.trackingId}`,
      `  Timestamp: ${this.context.timestamp}`,
      this.cause ? `  Cause: ${this.cause}` : null,
    ]
      .filter(Boolean)
      .join('\n');
  }
}

export class TimeoutError extends Error {
  public readonly code = ErrorCode.TIMEOUT;
  public readonly context: ErrorContext;

  constructor(
    message = 'Request timed out',
    public readonly timeoutMs?: number
  ) {
    super(message);
    this.name = 'TimeoutError';
    this.context = createErrorContext({
      metadata: timeoutMs ? { timeoutMs } : undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toDebugString(): string {
    return [
      `[${this.code}] ${this.name}: ${this.message}`,
      `  Tracking ID: ${this.context.trackingId}`,
      `  Timestamp: ${this.context.timestamp}`,
      this.timeoutMs ? `  Timeout: ${this.timeoutMs}ms` : null,
    ]
      .filter(Boolean)
      .join('\n');
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Map HTTP status code to error code
 */
function mapStatusToErrorCode(status: number): ErrorCodeType {
  const statusMap: Record<number, ErrorCodeType> = {
    400: ErrorCode.BAD_REQUEST,
    401: ErrorCode.UNAUTHORIZED,
    403: ErrorCode.FORBIDDEN,
    404: ErrorCode.NOT_FOUND,
    422: ErrorCode.VALIDATION_FAILED,
    429: ErrorCode.RATE_LIMITED,
    500: ErrorCode.INTERNAL_SERVER_ERROR,
    502: ErrorCode.BAD_GATEWAY,
    503: ErrorCode.SERVICE_UNAVAILABLE,
    504: ErrorCode.GATEWAY_TIMEOUT,
  };
  return statusMap[status] || ErrorCode.UNKNOWN;
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard to check if an error is a NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

/**
 * Type guard to check if an error is a TimeoutError
 */
export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError;
}

/**
 * Check if error has a specific error code
 */
export function hasErrorCode(error: unknown, code: ErrorCodeType): boolean {
  if (isApiError(error) || isNetworkError(error) || isTimeoutError(error)) {
    return error.code === code;
  }
  return false;
}

/**
 * Get tracking ID from any error type
 */
export function getTrackingId(error: unknown): string | undefined {
  if (
    error &&
    typeof error === 'object' &&
    'context' in error &&
    error.context &&
    typeof error.context === 'object' &&
    'trackingId' in error.context
  ) {
    return error.context.trackingId as string;
  }
  return undefined;
}

/**
 * Format any error for logging
 */
export function formatErrorForLog(error: unknown): string {
  if (isApiError(error)) {
    return error.toDebugString();
  }
  if (isNetworkError(error) || isTimeoutError(error)) {
    return error.toDebugString();
  }
  if (error instanceof Error) {
    return `[ERR] ${error.name}: ${error.message}\n  Stack: ${error.stack}`;
  }
  return `[ERR] Unknown error: ${String(error)}`;
}
