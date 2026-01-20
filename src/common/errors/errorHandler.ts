import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '@/common/errors/AppError';
import { sendError } from '@/common/response/response.helper';
import { env } from '@/config/env';
import { LoggingService } from '@/common/logging/logging.service';

/**
 * Global error handler for Fastify
 *
 * Catches all errors and formats them using the standard error response
 */
export const errorHandler = (
  error: Error | FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply
): void => {
  // Log error using Fastify's native request logger
  request.log.error(error);

  // Log error to database for tracking
  if (!request.url.startsWith('/documentation')) {
    LoggingService.logError(error, request).catch(err => {
      request.log.error(err, 'Failed to log error to DB');
    });
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationError = new ValidationError('Validation failed', error.issues);
    sendError(
      reply,
      validationError.message,
      validationError.statusCode,
      validationError.errorCode,
      validationError.errors
    );
    return;
  }

  // Handle custom AppError
  if (error instanceof AppError) {
    sendError(reply, error.message, error.statusCode, error.errorCode);
    return;
  }

  // Handle Fastify errors
  if ('statusCode' in error && error.statusCode) {
    sendError(reply, error.message, (error as FastifyError).statusCode);
    return;
  }

  // Handle unknown errors
  const message = env.NODE_ENV === 'production' ? 'Internal server error' : error.message;

  sendError(reply, message, 500, 'INTERNAL_ERROR');
};
