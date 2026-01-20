import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Environment variables schema with validation
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

  // Server
  PORT: z.string().default('3000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters').optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Bcrypt
  BCRYPT_ROUNDS: z.string().default('10').transform(Number),

  // MinIO
  MINIO_ENDPOINT: z.string().default('localhost'),
  MINIO_PORT: z.string().default('9000').transform(Number),
  MINIO_ACCESS_KEY: z.string().default('minioadmin'),
  MINIO_SECRET_KEY: z.string().default('minioadmin'),
  MINIO_USE_SSL: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  MINIO_BUCKET: z.string().default('portal-uploads'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

/**
 * Validate and parse environment variables
 */
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.issues.forEach((err: z.ZodIssue) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

/**
 * Validated environment configuration
 */
export const env = parseEnv();

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>;
