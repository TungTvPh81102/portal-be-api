import { FastifyInstance } from 'fastify';
import { usersRoutes } from '@/modules/users/users.route';
import { authRoutes } from '@/modules/auth/auth.route';
import { rolesRoutes } from '@/modules/roles/roles.route';
import { permissionsRoutes } from '@/modules/permissions/permissions.route';

/**
 * Register all application routes
 *
 * Centralized route registration for all modules
 */
export const registerRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // API prefix
  await fastify.register(async (instance) => {
    // Health check endpoint
    instance.get('/health', async () => ({
      status: 'ok',
      timestamp: new Date().toISOString(
        
      ),
    }));

    // Register module routes
    await instance.register(authRoutes, { prefix: '/api' });
    await instance.register(usersRoutes, { prefix: '/api' });
    await instance.register(rolesRoutes, { prefix: '/api' });
    await instance.register(permissionsRoutes, { prefix: '/api' });
  });
};
