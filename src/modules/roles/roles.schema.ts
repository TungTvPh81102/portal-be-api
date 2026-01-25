import { z } from 'zod';

/**
 * Create role request schema
 */
export const createRoleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional().nullable(),
});

/**
 * Update role request schema
 */
export const updateRoleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  slug: z.string().min(2, 'Slug must be at least 2 characters').optional(),
  description: z.string().optional().nullable(),
});

/**
 * Assign permissions request schema
 */
export const assignPermissionsSchema = z.object({
  permissionIds: z.array(z.string().regex(/^\d+$/, 'Invalid permission ID')).min(1, 'At least one permission ID is required'),
});

/**
 * Role ID param schema (using bigint as string)
 */
export const roleIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid role ID format (must be a number)'),
});

/**
 * Type exports
 */
export type CreateRoleDto = z.infer<typeof createRoleSchema>;
export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;
export type AssignPermissionsDto = z.infer<typeof assignPermissionsSchema>;
export type RoleIdParam = z.infer<typeof roleIdParamSchema>;
