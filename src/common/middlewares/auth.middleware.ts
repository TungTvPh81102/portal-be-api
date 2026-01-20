import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken, JwtPayload } from '@/common/utils/jwt.helper';
import { UnauthorizedError } from '@/common/errors/AppError';

/**
 * Extend Fastify request to include user
 */
declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

/**
 * Authentication middleware
 *
 * Verifies JWT token from Authorization header and attaches user to request
 */
export const authMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('No authorization header provided');
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Invalid authorization format. Use: Bearer <token>');
    }

    // Extract token
    const token = authHeader.substring(7);

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user to request
    request.user = decoded;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Invalid or expired token');
  }
};
