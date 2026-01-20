import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AuthController } from '@/modules/auth/auth.controller';
import { authMiddleware } from '@/common/middlewares/auth.middleware';
import { loginSchema, registerSchema, refreshTokenSchema } from '@/modules/auth/auth.schema';

/**
 * Auth routes
 *
 * Registers all authentication-related endpoints
 */
export const authRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const authController = new AuthController();

  // Public routes
  fastify.post('/auth/login', {
    schema: {
      tags: ['Auth'],
      description: 'Login with email and password',
      body: loginSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: z.object({
            user: z.any(),
            accessToken: z.string(),
            refreshToken: z.string(),
          }),
        }),
      },
    },
    handler: authController.login,
  });

  fastify.post('/auth/register', {
    schema: {
      tags: ['Auth'],
      description: 'Register a new user',
      body: registerSchema,
      response: {
        201: z.object({
          message: z.string(),
          data: z.object({
            user: z.any(),
            accessToken: z.string(),
            refreshToken: z.string(),
          }),
        }),
      },
    },
    handler: authController.register,
  });

  fastify.post('/auth/refresh', {
    schema: {
      tags: ['Auth'],
      description: 'Refresh access token using refresh token',
      body: refreshTokenSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
          }),
        }),
      },
    },
    handler: authController.refreshToken,
  });

  fastify.post('/auth/logout', {
    schema: {
      tags: ['Auth'],
      description: 'Logout and invalidate refresh token',
      body: refreshTokenSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: z.null(),
        }),
      },
    },
    handler: authController.logout,
  });

  // Protected routes
  fastify.get('/auth/me', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Auth'],
      description: 'Get current user information',
      security: [{ bearerAuth: [] }],
      response: {
        200: z.object({
          message: z.string(),
          data: z.any(),
        }),
      },
    },
    handler: authController.getCurrentUser,
  });
};
