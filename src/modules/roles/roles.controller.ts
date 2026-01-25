import { FastifyRequest, FastifyReply } from 'fastify';
import { RolesService } from './roles.service';
import { createRoleSchema, updateRoleSchema, roleIdParamSchema, assignPermissionsSchema, CreateRoleDto, UpdateRoleDto, RoleIdParam, AssignPermissionsDto } from './roles.schema';
import { sendSuccess } from '@/common/response/response.helper';

/**
 * Roles Controller
 *
 * Handles HTTP requests for roles.
 */
export class RolesController {
  private rolesService: RolesService;

  constructor() {
    this.rolesService = new RolesService();
    // Bind methods to preserve 'this' context
    this.createRole = this.createRole.bind(this);
    this.getAllRoles = this.getAllRoles.bind(this);
    this.getRoleById = this.getRoleById.bind(this);
    this.getRoleWithPermissions = this.getRoleWithPermissions.bind(this);
    this.updateRole = this.updateRole.bind(this);
    this.deleteRole = this.deleteRole.bind(this);
    this.syncPermissions = this.syncPermissions.bind(this);
  }

  /**
   * Create a new role
   */
  async createRole(
    request: FastifyRequest<{ Body: CreateRoleDto }>,
    reply: FastifyReply
  ) {
    const data = createRoleSchema.parse(request.body);
    const role = await this.rolesService.createRole(data);

    return sendSuccess(reply, role, 'Role created successfully', 201);
  }

  /**
   * Get all roles with pagination
   */
  async getAllRoles(
    request: FastifyRequest<{ Querystring: { page?: string, limit?: string } }>,
    reply: FastifyReply
  ) {
    const page = request.query.page ? parseInt(request.query.page) : 1;
    const limit = request.query.limit ? parseInt(request.query.limit) : 10;

    const result = await this.rolesService.getAllRoles(page, limit);

    return sendSuccess(reply, result, 'Roles retrieved successfully');
  }

  /**
   * Get role by ID
   */
  async getRoleById(
    request: FastifyRequest<{ Params: RoleIdParam }>,
    reply: FastifyReply
  ) {
    const { id } = roleIdParamSchema.parse(request.params);
    const role = await this.rolesService.getRoleById(id);

    return sendSuccess(reply, role, 'Role retrieved successfully');
  }

  /**
   * Get role with its permissions
   */
  async getRoleWithPermissions(
    request: FastifyRequest<{ Params: RoleIdParam }>,
    reply: FastifyReply
  ) {
    const { id } = roleIdParamSchema.parse(request.params);
    const result = await this.rolesService.getRoleWithPermissions(id);

    return sendSuccess(reply, result, 'Role with permissions retrieved successfully');
  }

  /**
   * Update role
   */
  async updateRole(
    request: FastifyRequest<{ Params: RoleIdParam, Body: UpdateRoleDto }>,
    reply: FastifyReply
  ) {
    const { id } = roleIdParamSchema.parse(request.params);
    const data = updateRoleSchema.parse(request.body);
    
    const role = await this.rolesService.updateRole(id, data);

    return sendSuccess(reply, role, 'Role updated successfully');
  }

  /**
   * Delete role
   */
  async deleteRole(
    request: FastifyRequest<{ Params: RoleIdParam }>,
    reply: FastifyReply
  ) {
    const { id } = roleIdParamSchema.parse(request.params);
    await this.rolesService.deleteRole(id);

    return reply.status(204).send();
  }

  /**
   * Sync permissions for a role
   */
  async syncPermissions(
    request: FastifyRequest<{ Params: RoleIdParam, Body: AssignPermissionsDto }>,
    reply: FastifyReply
  ) {
    const { id } = roleIdParamSchema.parse(request.params);
    const { permissionIds } = assignPermissionsSchema.parse(request.body);

    await this.rolesService.syncPermissions(id, permissionIds);

    return sendSuccess(reply, null, 'Permissions synced successfully');
  }
}
