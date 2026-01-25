import { FastifyRequest, FastifyReply } from 'fastify';
import { PermissionsService } from './permissions.service';
import { createPermissionSchema, updatePermissionSchema, permissionIdParamSchema, CreatePermissionDto, UpdatePermissionDto, PermissionIdParam } from './permissions.schema';
import { sendSuccess } from '@/common/response/response.helper';

/**
 * Permissions Controller
 *
 * Handles HTTP requests for permissions.
 */
export class PermissionsController {
  private permissionsService: PermissionsService;

  constructor() {
    this.permissionsService = new PermissionsService();
    // Bind methods to preserve 'this' context
    this.createPermission = this.createPermission.bind(this);
    this.getAllPermissions = this.getAllPermissions.bind(this);
    this.getPermissionById = this.getPermissionById.bind(this);
    this.updatePermission = this.updatePermission.bind(this);
    this.deletePermission = this.deletePermission.bind(this);
  }

  /**
   * Create a new permission
   */
  async createPermission(
    request: FastifyRequest<{ Body: CreatePermissionDto }>,
    reply: FastifyReply
  ) {
    const data = createPermissionSchema.parse(request.body);
    const permission = await this.permissionsService.createPermission(data);

    return sendSuccess(reply, permission, 'Permission created successfully', 201);
  }

  /**
   * Get all permissions with pagination
   */
  async getAllPermissions(
    request: FastifyRequest<{ Querystring: { page?: string, limit?: string } }>,
    reply: FastifyReply
  ) {
    const page = request.query.page ? parseInt(request.query.page) : 1;
    const limit = request.query.limit ? parseInt(request.query.limit) : 10;

    const result = await this.permissionsService.getAllPermissions(page, limit);

    return sendSuccess(reply, result, 'Permissions retrieved successfully');
  }

  /**
   * Get permission by ID
   */
  async getPermissionById(
    request: FastifyRequest<{ Params: PermissionIdParam }>,
    reply: FastifyReply
  ) {
    const { id } = permissionIdParamSchema.parse(request.params);
    const permission = await this.permissionsService.getPermissionById(id);

    return sendSuccess(reply, permission, 'Permission retrieved successfully');
  }

  /**
   * Update permission
   */
  async updatePermission(
    request: FastifyRequest<{ Params: PermissionIdParam, Body: UpdatePermissionDto }>,
    reply: FastifyReply
  ) {
    const { id } = permissionIdParamSchema.parse(request.params);
    const data = updatePermissionSchema.parse(request.body);
    
    const permission = await this.permissionsService.updatePermission(id, data);

    return sendSuccess(reply, permission, 'Permission updated successfully');
  }

  /**
   * Delete permission
   */
  async deletePermission(
    request: FastifyRequest<{ Params: PermissionIdParam }>,
    reply: FastifyReply
  ) {
    const { id } = permissionIdParamSchema.parse(request.params);
    await this.permissionsService.deletePermission(id);

    return reply.status(204).send();
  }
}
