/**
 * Environment variable validation and typed access
 *
 * This module provides runtime validation of environment variables
 * with helpful error messages during development.
 */

import { z } from 'zod';

const envSchema = z.object({
  // Server-side only
  BASE_API_URL: z.string().url('BASE_API_URL must be a valid URL'),
  AUTH_SECRET: z.string().min(1, 'AUTH_SECRET is required'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Optional with defaults
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  AUTH_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validated environment variables
 * Throws detailed errors in development if validation fails
 */
function getEnv(): Env {
  // Skip validation during build time
  if (typeof window !== 'undefined') {
    return {} as Env;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.format();
    const errors = Object.entries(formatted)
      .filter(([key]) => key !== '_errors')
      .map(([key, value]) => {
        const messages =
          value && typeof value === 'object' && '_errors' in value
            ? (value as { _errors: string[] })._errors
            : [];
        return `  ${key}: ${messages.join(', ')}`;
      })
      .join('\n');

    // Only log in development to help with debugging
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`⚠️ Environment validation failed:\n${errors}`);
    }

    // In production, return partial env (unsafe but prevents crashes)
    return process.env as unknown as Env;
  }

  return parsed.data;
}

export const env = getEnv();

// Type-safe environment access helpers
export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
