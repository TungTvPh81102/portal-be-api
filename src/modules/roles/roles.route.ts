import { FastifyInstance } from 'fastify';
import { RolesController } from './roles.controller';
import { rolesSchema } from './roles.schema';

export const rolesRoutes = async (fastify: FastifyInstance) => {
  const controller = new RolesController();

  fastify.get('/', {
    schema: rolesSchema.getAll,
    handler: controller.getAll
  });

  fastify.get('/:id', {
    schema: rolesSchema.getById,
    handler: controller.getById
  });
}