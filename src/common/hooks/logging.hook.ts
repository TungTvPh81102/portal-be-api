import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { LoggingService } from '../logging/logging.service';

/**
 * Register logging hooks to capture API request/response cycles
 */
export const registerLoggingHooks = (fastify: FastifyInstance) => {
  // Store start time for each request
  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    (request as any).startTime = process.hrtime();
  });

  // Log on response completion
  fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    // Skip logging for documentation routes
    if (request.url.startsWith('/documentation')) {
      return;
    }

    const startTime = (request as any).startTime;
    if (startTime) {
      const diff = process.hrtime(startTime);
      const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6);
      
      // We don't await this to avoid blocking the response ending
      LoggingService.logRequest(request, reply, durationMs).catch(err => {
        fastify.log.error(err, 'Failed to log request to DB');
      });
    }
  });
};
