/**
 * API constants and configuration
 *
 * Centralized configuration for API-related settings
 */

// Headers to strip from proxied requests
export const PROXY_STRIP_HEADERS = [
  'host',
  'connection',
  'content-length',
  'cookie',
  'set-cookie',
] as const;

// Headers to preserve for file uploads
export const MULTIPART_CONTENT_TYPE = 'multipart/form-data';

// Default timeout for API requests (ms)
export const DEFAULT_TIMEOUT = 15_000;

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableStatusCodes: [502, 503, 504],
} as const;

// HTTP methods that should not have a body
export const BODYLESS_METHODS = ['GET', 'HEAD'] as const;
export type BodylessMethod = (typeof BODYLESS_METHODS)[number];

// HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request/Response content types
export const CONTENT_TYPES = {
  json: 'application/json',
  formData: 'multipart/form-data',
  urlEncoded: 'application/x-www-form-urlencoded',
} as const;
