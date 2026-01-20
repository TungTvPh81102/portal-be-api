import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '@/config/env';

/**
 * Database client configuration
 */
const queryClient = postgres(env.DATABASE_URL);

import { DbLogger } from '@/common/logging/drizzle.logger';

/**
 * Drizzle ORM instance
 */
export const db = drizzle(queryClient, { 
  schema, 
  logger: new DbLogger() 
});

/**
 * Export schema for easy access
 */
export * from './schema';

/**
 * Database connection status check
 */
export const checkConnection = async () => {
  try {
    await queryClient`SELECT 1`;
    console.log('✅ Database connected successfully (Drizzle)');
  } catch (error) {
    console.error('❌ Database connection error (Drizzle):', error);
    throw error;
  }
};
