import { FastifyRequest, FastifyReply } from 'fastify';
import { UsersService } from '@/modules/users/users.service';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  CreateUserDto,
  UpdateUserDto,
  UserIdParam,
} from '@/modules/users/users.schema';
import { ok, created } from '@/common/response/response.helper';
import { ValidationError } from '@/common/errors/AppError';

/**
 * Users Controller
 *
 * Handles HTTP requests, validates input, and calls service methods.
 * NO business logic - only request/response handling.
 */
export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  /**
   * Create new user
   * POST /users
   */
  createUser = async (
    request: FastifyRequest<{ Body: CreateUserDto }>,
    reply: FastifyReply
  ): Promise<FastifyReply> => {
    try {
      // Validate request body
      const validatedData = createUserSchema.parse(request.body);

      // Call service
      const user = await this.usersService.createUser(validatedData);

      // Return success response
      return created(reply, user, 'User created successfully');
    } catch (error) {
      throw error;
    }
  };

  /**
   * Get user by ID
   * GET /users/:id
   */
  getUserById = async (
    request: FastifyRequest<{ Params: UserIdParam }>,
    reply: FastifyReply
  ): Promise<FastifyReply> => {
    try {
      // Validate params
      const { id } = userIdParamSchema.parse(request.params);

      // Call service
      const user = await this.usersService.getUserById(id);

      // Return success response
      return ok(reply, user, 'User retrieved successfully');
    } catch (error) {
      throw error;
    }
  };

  /**
   * Get all users with pagination
   * GET /users?page=1&limit=10
   */
  getAllUsers = async (
    request: FastifyRequest<{
      Querystring: { page?: string; limit?: string };
    }>,
    reply: FastifyReply
  ): Promise<FastifyReply> => {
    try {
      const page = request.query.page ? parseInt(request.query.page, 10) : 1;
      const limit = request.query.limit ? parseInt(request.query.limit, 10) : 10;

      // Validate pagination
      if (page < 1 || limit < 1 || limit > 100) {
        throw new ValidationError('Invalid pagination parameters');
      }

      // Call service
      const result = await this.usersService.getAllUsers(page, limit);

      // Return success response
      return ok(reply, result, 'Users retrieved successfully');
    } catch (error) {
      throw error;
    }
  };

  /**
   * Update user
   * PUT /users/:id
   */
  updateUser = async (
    request: FastifyRequest<{
      Params: UserIdParam;
      Body: UpdateUserDto;
    }>,
    reply: FastifyReply
  ): Promise<FastifyReply> => {
    try {
      // Validate params and body
      const { id } = userIdParamSchema.parse(request.params);
      const validatedData = updateUserSchema.parse(request.body);

      // Call service
      const user = await this.usersService.updateUser(id, validatedData);

      // Return success response
      return ok(reply, user, 'User updated successfully');
    } catch (error) {
      throw error;
    }
  };

  /**
   * Delete user
   * DELETE /users/:id
   */
  deleteUser = async (
    request: FastifyRequest<{ Params: UserIdParam }>,
    reply: FastifyReply
  ): Promise<FastifyReply> => {
    try {
      // Validate params
      const { id } = userIdParamSchema.parse(request.params);

      // Call service
      await this.usersService.deleteUser(id);

      // Return success response
      return ok(reply, null, 'User deleted successfully');
    } catch (error) {
      throw error;
    }
  };
}
