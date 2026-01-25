import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PermissionsController } from './permissions.controller';
import { createPermissionSchema, updatePermissionSchema, permissionIdParamSchema } from './permissions.schema';
import { authMiddleware } from '@/common/middlewares/auth.middleware';

/**
 * Permissions routes
 *
 * Registers all permission-related endpoints
 */
export const permissionsRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const permissionsController = new PermissionsController();

  // All permission routes are protected
  fastify.addHook('preHandler', authMiddleware);

  fastify.post('/permissions', {
    schema: {
      tags: ['Permissions'],
      description: 'Create a new permission',
      security: [{ bearerAuth: [] }],
      body: createPermissionSchema,
      response: {
        201: z.object({
          message: z.string(),
          data: z.any(),
        }),
      },
    },
    handler: permissionsController.createPermission,
  });

  fastify.get('/permissions', {
    schema: {
      tags: ['Permissions'],
      description: 'Get all permissions',
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
    handler: permissionsController.getAllPermissions,
  });

  fastify.get('/permissions/:id', {
    schema: {
      tags: ['Permissions'],
      description: 'Get permission by ID',
      security: [{ bearerAuth: [] }],
      params: permissionIdParamSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: z.any(),
        }),
      },
    },
    handler: permissionsController.getPermissionById,
  });

  fastify.put('/permissions/:id', {
    schema: {
      tags: ['Permissions'],
      description: 'Update permission',
      security: [{ bearerAuth: [] }],
      params: permissionIdParamSchema,
      body: updatePermissionSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: z.any(),
        }),
      },
    },
    handler: permissionsController.updatePermission,
  });

  fastify.delete('/permissions/:id', {
    schema: {
      tags: ['Permissions'],
      description: 'Delete permission',
      security: [{ bearerAuth: [] }],
      params: permissionIdParamSchema,
      response: {
        204: z.null(),
      },
    },
    handler: permissionsController.deletePermission,
  });
};
