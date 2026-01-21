import { FastifyInstance } from 'fastify';
import { usersRoutes } from '@/modules/users/users.route';
import { authRoutes } from '@/modules/auth/auth.route';
import { logsRoutes } from '@/modules/logs/logs.route';

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
    
    // Admin routes - Monitoring & Logs (Laravel Telescope-like)
    await instance.register(logsRoutes, { prefix: '/api/admin/logs' });
  });
};
