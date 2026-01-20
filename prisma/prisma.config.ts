import { env } from '../src/config/env';

/**
 * Prisma configuration for Prisma v7
 * 
 * This file replaces the url property in the datasource block of schema.prisma
 * See: https://pris.ly/d/config-datasource and https://pris.ly/d/prisma7-client-config
 */
export default {
  // Use Accelerate URL for database connection
  // This is a simpler approach for Prisma v7
  accelerateUrl: env.DATABASE_URL,
};
