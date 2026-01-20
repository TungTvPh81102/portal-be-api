import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { UsersController } from '@/modules/users/users.controller';
import { createUserSchema, updateUserSchema, userIdParamSchema } from '@/modules/users/users.schema';
import { authMiddleware } from '@/common/middlewares/auth.middleware';

/**
 * Users routes
 *
 * Registers all user-related endpoints
 */
export const usersRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const usersController = new UsersController();

  // All user routes are protected
  fastify.addHook('preHandler', authMiddleware);

  fastify.post('/users', {
    schema: {
      tags: ['Users'],
      description: 'Create a new user',
      security: [{ bearerAuth: [] }],
      body: createUserSchema,
      response: {
        201: z.object({
          message: z.string(),
          data: z.any(),
        }),
      },
    },
    handler: usersController.createUser,
  });

  fastify.get('/users', {
    schema: {
      tags: ['Users'],
      description: 'Get all users',
      security: [{ bearerAuth: [] }],
      response: {
        200: z.object({
          message: z.string(),
          data: z.array(z.any()),
        }),
      },
    },
    handler: usersController.getAllUsers,
  });

  fastify.get('/users/:id', {
    schema: {
      tags: ['Users'],
      description: 'Get user by ID',
      security: [{ bearerAuth: [] }],
      params: userIdParamSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: z.any(),
        }),
      },
    },
    handler: usersController.getUserById,
  });

  fastify.put('/users/:id', {
    schema: {
      tags: ['Users'],
      description: 'Update user',
      security: [{ bearerAuth: [] }],
      params: userIdParamSchema,
      body: updateUserSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: z.any(),
        }),
      },
    },
    handler: usersController.updateUser,
  });

  fastify.delete('/users/:id', {
    schema: {
      tags: ['Users'],
      description: 'Delete user',
      security: [{ bearerAuth: [] }],
      params: userIdParamSchema,
      response: {
        204: z.null(),
      },
    },
    handler: usersController.deleteUser,
  });
};
