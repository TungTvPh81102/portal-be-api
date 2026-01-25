import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { RolesController } from './roles.controller';
import { createRoleSchema, updateRoleSchema, roleIdParamSchema, assignPermissionsSchema } from './roles.schema';
import { authMiddleware } from '@/common/middlewares/auth.middleware';

/**
 * Roles routes
 *
 * Registers all role-related endpoints
 */
export const rolesRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const rolesController = new RolesController();

  // All role routes are protected
  fastify.addHook('preHandler', authMiddleware);

  fastify.post('/roles', {
    schema: {
      tags: ['Roles'],
      description: 'Create a new role',
      security: [{ bearerAuth: [] }],
      body: createRoleSchema,
      response: {
        201: z.object({
          message: z.string(),
          data: z.any(),
        }),
      },
    },
    handler: rolesController.createRole,
  });

  fastify.get('/roles', {
    schema: {
      tags: ['Roles'],
      description: 'Get all roles',
      security: [{ bearerAuth: [] }],
      querystring: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
      }),
      response: {
        200: z.object({
          message: z.string(),
          data: z.any(),
        }),
      },
    },
    handler: rolesController.getAllRoles,
  });

  fastify.get('/roles/:id', {
    schema: {
      tags: ['Roles'],
      description: 'Get role by ID',
      security: [{ bearerAuth: [] }],
      params: roleIdParamSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: z.any(),
        }),
      },
    },
    handler: rolesController.getRoleById,
  });

  fastify.get('/roles/:id/permissions', {
    schema: {
      tags: ['Roles'],
      description: 'Get role with permissions',
      security: [{ bearerAuth: [] }],
      params: roleIdParamSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: z.any(),
        }),
      },
    },
    handler: rolesController.getRoleWithPermissions,
  });

  fastify.put('/roles/:id', {
    schema: {
      tags: ['Roles'],
      description: 'Update role',
      security: [{ bearerAuth: [] }],
      params: roleIdParamSchema,
      body: updateRoleSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: z.any(),
        }),
      },
    },
    handler: rolesController.updateRole,
  });

  fastify.delete('/roles/:id', {
    schema: {
      tags: ['Roles'],
      description: 'Delete role',
      security: [{ bearerAuth: [] }],
      params: roleIdParamSchema,
      response: {
        204: z.null(),
      },
    },
    handler: rolesController.deleteRole,
  });

  fastify.post('/roles/:id/permissions', {
    schema: {
      tags: ['Roles'],
      description: 'Sync permissions for a role',
      security: [{ bearerAuth: [] }],
      params: roleIdParamSchema,
      body: assignPermissionsSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: z.any(),
        }),
      },
    },
    handler: rolesController.syncPermissions,
  });
};
