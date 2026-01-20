import { FastifyReply } from 'fastify';

/**
 * Standard success response format
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
  errors?: unknown;
}

/**
 * Base success response sender
 */
export const sendSuccess = <T = unknown>(
  reply: FastifyReply,
  data: T,
  message = 'Success',
  statusCode = 200
): FastifyReply => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    data,
  };
  return reply.status(statusCode).send(response);
};

/**
 * Base error response sender
 */
export const sendError = (
  reply: FastifyReply,
  message: string,
  statusCode = 500,
  errorCode?: string,
  errors?: unknown
): FastifyReply => {
  const response: ErrorResponse = {
    success: false,
    message,
    ...(errorCode ? { errorCode } : {}),
    ...(errors ? { errors } : {}),
  };
  return reply.status(statusCode).send(response);
};

// ========== SUCCESS HELPER ALIASES ==========

export const ok = <T = unknown>(reply: FastifyReply, data: T, message = 'Success') =>
  sendSuccess(reply, data, message, 200);

export const created = <T = unknown>(
  reply: FastifyReply,
  data: T,
  message = 'Created successfully'
) => sendSuccess(reply, data, message, 201);

export const accepted = <T = unknown>(reply: FastifyReply, data: T, message = 'Accepted') =>
  sendSuccess(reply, data, message, 202);

export const noContent = (reply: FastifyReply, message = 'No content') =>
  sendSuccess(reply, null, message, 204);

// ========== CLIENT ERROR HELPER ALIASES ==========

export const badRequest = (
  reply: FastifyReply,
  message = 'Bad request',
  errorCode = 'BAD_REQUEST'
) => sendError(reply, message, 400, errorCode);

export const unauthorized = (
  reply: FastifyReply,
  message = 'Unauthorized',
  errorCode = 'UNAUTHORIZED'
) => sendError(reply, message, 401, errorCode);

export const forbidden = (reply: FastifyReply, message = 'Forbidden', errorCode = 'FORBIDDEN') =>
  sendError(reply, message, 403, errorCode);

export const notFound = (
  reply: FastifyReply,
  message = 'Resource not found',
  errorCode = 'NOT_FOUND'
) => sendError(reply, message, 404, errorCode);

export const conflict = (reply: FastifyReply, message = 'Conflict', errorCode = 'CONFLICT') =>
  sendError(reply, message, 409, errorCode);

export const unprocessableEntity = (
  reply: FastifyReply,
  message = 'Validation failed',
  errors?: unknown
) => sendError(reply, message, 422, 'VALIDATION_ERROR', errors);

// ========== SERVER ERROR HELPER ALIASES ==========

export const internalServerError = (reply: FastifyReply, message = 'Internal server error') =>
  sendError(reply, message, 500, 'INTERNAL_SERVER_ERROR');
