/**
 * Shared library exports
 *
 * This file provides clean barrel exports for the shared library.
 * Import from '@/lib' for common utilities.
 */

// Environment configuration
export { env, isDev, isProd, isTest } from './env';
export type { Env } from './env';

// API utilities
export * from './api';
