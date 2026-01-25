import { z } from 'zod';

/**
 * Create permission request schema
 */
export const createPermissionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional().nullable(),
  resource: z.string().min(2, 'Resource must be at least 2 characters'),
  action: z.string().min(2, 'Action must be at least 2 characters'),
});

/**
 * Update permission request schema
 */
export const updatePermissionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  slug: z.string().min(2, 'Slug must be at least 2 characters').optional(),
  description: z.string().optional().nullable(),
  resource: z.string().min(2, 'Resource must be at least 2 characters').optional(),
  action: z.string().min(2, 'Action must be at least 2 characters').optional(),
});

/**
 * Permission ID param schema (using bigint as string)
 */
export const permissionIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid permission ID format (must be a number)'),
});

/**
 * Type exports
 */
export type CreatePermissionDto = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionDto = z.infer<typeof updatePermissionSchema>;
export type PermissionIdParam = z.infer<typeof permissionIdParamSchema>;
