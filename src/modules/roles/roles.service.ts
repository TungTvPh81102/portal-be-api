import { Role, Permission } from '@/db';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto, UpdateRoleDto } from './roles.schema';
import { NotFoundError, ConflictError } from '@/common/errors/AppError';

/**
 * Roles Service
 *
 * Contains all business logic for Role operations.
 */
export class RolesService {
  private rolesRepository: RolesRepository;

  constructor() {
    this.rolesRepository = new RolesRepository();
  }

  /**
   * Get role by ID
   */
  async getRoleById(id: string): Promise<Role> {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new NotFoundError('Role not found');
    }

    return role;
  }

  /**
   * Get role with permissions
   */
  async getRoleWithPermissions(id: string): Promise<{ role: Role, permissions: Permission[] }> {
    const result = await this.rolesRepository.findRoleWithPermissions(id);

    if (!result) {
      throw new NotFoundError('Role not found');
    }

    return result;
  }

  /**
   * Get all roles with pagination
   */
  async getAllRoles(
    page = 1,
    limit = 10
  ): Promise<{
    roles: Role[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [rolesList, total] = await Promise.all([
      this.rolesRepository.findAll(skip, limit),
      this.rolesRepository.count(),
    ]);

    return {
      roles: rolesList,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Create new role
   */
  async createRole(data: CreateRoleDto): Promise<Role> {
    // Check if role name already exists
    const existingRole = await this.rolesRepository.findByName(data.name);
    if (existingRole) {
      throw new ConflictError('Role name already exists');
    }

    // Check if slug exists
    const slugExists = await this.rolesRepository.findBySlug(data.slug);
    if (slugExists) {
      throw new ConflictError('Role slug already exists');
    }

    // Create role
    return this.rolesRepository.create(data);
  }

  /**
   * Update role
   */
  async updateRole(id: string, data: UpdateRoleDto): Promise<Role> {
    // Check if role exists
    const existingRole = await this.rolesRepository.findById(id);
    if (!existingRole) {
      throw new NotFoundError('Role not found');
    }

    // Check if name changed and if new name already exists
    if (data.name && data.name !== existingRole.name) {
      const nameExists = await this.rolesRepository.findByName(data.name);
      if (nameExists) {
        throw new ConflictError('Role name already exists');
      }
    }

    // Check if slug changed and if new slug already exists
    if (data.slug && data.slug !== existingRole.slug) {
      const slugExists = await this.rolesRepository.findBySlug(data.slug);
      if (slugExists) {
        throw new ConflictError('Role slug already exists');
      }
    }

    // Update role
    return this.rolesRepository.update(id, data);
  }

  /**
   * Delete role
   */
  async deleteRole(id: string): Promise<void> {
    // Check if role exists
    const existingRole = await this.rolesRepository.findById(id);
    if (!existingRole) {
      throw new NotFoundError('Role not found');
    }

    await this.rolesRepository.delete(id);
  }

  /**
   * Sync permissions for a role
   */
  async syncPermissions(roleId: string, permissionIds: string[]): Promise<void> {
    // Check if role exists
    const existingRole = await this.rolesRepository.findById(roleId);
    if (!existingRole) {
      throw new NotFoundError('Role not found');
    }

    await this.rolesRepository.syncPermissions(roleId, permissionIds);
  }
}
