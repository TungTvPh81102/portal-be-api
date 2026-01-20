import { FastifyInstance } from 'fastify';
import { PermissionsController } from './permissions.controller';
import { permissionsSchema } from './permissions.schema';

export const permissionsRoutes = async (fastify: FastifyInstance) => {
  const controller = new PermissionsController();

  fastify.get('/', {
    schema: permissionsSchema.getAll,
    handler: controller.getAll
  });

  fastify.get('/:id', {
    schema: permissionsSchema.getById,
    handler: controller.getById
  });
}