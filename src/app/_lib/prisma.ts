/**
 * Prisma Client Instance
 *
 * Singleton pattern to prevent multiple instances during development
 * hot-reloading. Uses global storage to persist across module reloads.
 *
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */

import { PrismaClient } from '@prisma/client';
import { isDev } from '@/lib/env';

// Extend globalThis with prisma for TypeScript
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

/**
 * Create Prisma client with appropriate logging
 */
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: isDev ? ['error', 'warn'] : ['error'],
  });
}

/**
 * Singleton Prisma client instance
 *
 * In development: Reuses existing instance to prevent connection pool exhaustion
 * In production: Creates a new instance (managed by serverless runtime)
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Store in global during development to prevent multiple instances
if (isDev) {
  globalForPrisma.prisma = prisma;
}
