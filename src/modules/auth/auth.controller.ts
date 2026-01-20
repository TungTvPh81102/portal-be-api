import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '@/modules/auth/auth.service';
import { loginSchema, registerSchema, refreshTokenSchema, LoginDto, RegisterDto, RefreshTokenDto } from '@/modules/auth/auth.schema';
import { ok, created } from '@/common/response/response.helper';

/**
 * Auth Controller
 *
 * Handles authentication requests
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Login
   * POST /auth/login
   */
  login = async (
    request: FastifyRequest<{ Body: LoginDto }>,
    reply: FastifyReply
  ): Promise<FastifyReply> => {
    try {
      // Validate request body
      const validatedData = loginSchema.parse(request.body);

      // Call service
      const result = await this.authService.login(validatedData);

      // Return success response
      return ok(reply, result, 'Login successful');
    } catch (error) {
      throw error;
    }
  };

  /**
   * Register
   * POST /auth/register
   */
  register = async (
    request: FastifyRequest<{ Body: RegisterDto }>,
    reply: FastifyReply
  ): Promise<FastifyReply> => {
    try {
      // Validate request body
      const validatedData = registerSchema.parse(request.body);

      // Call service
      const result = await this.authService.register(validatedData);

      // Return success response
      return created(reply, result, 'Registration successful');
    } catch (error) {
      throw error;
    }
  };

  /**
   * Refresh Token
   * POST /auth/refresh
   */
  refreshToken = async (
    request: FastifyRequest<{ Body: RefreshTokenDto }>,
    reply: FastifyReply
  ): Promise<FastifyReply> => {
    try {
      const validatedData = refreshTokenSchema.parse(request.body);
      const result = await this.authService.refreshToken(validatedData);
      return ok(reply, result, 'Token refreshed successfully');
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout
   * POST /auth/logout
   */
  logout = async (
    request: FastifyRequest<{ Body: RefreshTokenDto }>,
    reply: FastifyReply
  ): Promise<FastifyReply> => {
    try {
      const validatedData = refreshTokenSchema.parse(request.body);
      await this.authService.logout(validatedData.refreshToken);
      return ok(reply, null, 'Logged out successfully');
    } catch (error) {
      throw error;
    }
  };

  /**
   * Get current user
   * GET /auth/me
   */
  getCurrentUser = async (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> => {
    try {
      // User is attached by auth middleware
      const userId = request.user?.userId;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Call service
      const user = await this.authService.getCurrentUser(userId);

      // Return success response
      return ok(reply, user, 'User retrieved successfully');
    } catch (error) {
      throw error;
    }
  };
}
