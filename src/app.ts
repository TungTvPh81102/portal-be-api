import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { env } from '@/config/env';
import { errorHandler } from '@/common/errors/errorHandler';
import { registerRoutes } from '@/routes';
import { registerSwagger } from '@/config/swagger';

/**
 * Create and configure Fastify application
 */
export const createApp = async (): Promise<FastifyInstance> => {
  // Create Fastify instance with default logger
  const fastify = Fastify({
    logger:
      env.NODE_ENV === 'development'
        ? {
            transport: {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            },
          }
        : true,
  });

  // Register CORS
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  // Register Swagger
  await registerSwagger(fastify);

  // Register logging hooks
  const { registerLoggingHooks } = await import('@/common/hooks/logging.hook');
  registerLoggingHooks(fastify);

  // Register error handler
  fastify.setErrorHandler(errorHandler);

  // Register routes
  await registerRoutes(fastify);

  return fastify;
};
