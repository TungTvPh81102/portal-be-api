import { z } from 'zod';

/**
 * Create user request schema
 */
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

/**
 * Update user request schema
 */
export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  enable: z.number().int().min(0).max(1).optional(),
});

/**
 * User ID param schema
 */
export const userIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid user ID format (must be a number)'),
});

/**
 * Type exports
 */
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
