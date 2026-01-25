import { Permission } from '@/db';
import { PermissionsRepository } from './permissions.repository';
import { CreatePermissionDto, UpdatePermissionDto } from './permissions.schema';
import { NotFoundError, ConflictError } from '@/common/errors/AppError';

/**
 * Permissions Service
 *
 * Contains all business logic for Permission operations.
 */
export class PermissionsService {
  private permissionsRepository: PermissionsRepository;

  constructor() {
    this.permissionsRepository = new PermissionsRepository();
  }

  /**
   * Get permission by ID
   */
  async getPermissionById(id: string): Promise<Permission> {
    const permission = await this.permissionsRepository.findById(id);

    if (!permission) {
      throw new NotFoundError('Permission not found');
    }

    return permission;
  }

  /**
   * Get all permissions with pagination
   */
  async getAllPermissions(
    page = 1,
    limit = 10
  ): Promise<{
    permissions: Permission[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [permissionsList, total] = await Promise.all([
      this.permissionsRepository.findAll(skip, limit),
      this.permissionsRepository.count(),
    ]);

    return {
      permissions: permissionsList,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Create new permission
   */
  async createPermission(data: CreatePermissionDto): Promise<Permission> {
    // Check if permission already exists for this resource and action
    const exists = await this.permissionsRepository.exists(data.resource, data.action);
    if (exists) {
      throw new ConflictError(`Permission already exists for resource '${data.resource}' and action '${data.action}'`);
    }

    // Check if slug exists
    const slugExists = await this.permissionsRepository.findBySlug(data.slug);
    if (slugExists) {
      throw new ConflictError(`Permission slug '${data.slug}' already exists`);
    }

    // Create permission
    return this.permissionsRepository.create(data);
  }

  /**
   * Update permission
   */
  async updatePermission(id: string, data: UpdatePermissionDto): Promise<Permission> {
    // Check if permission exists
    const existingPermission = await this.permissionsRepository.findById(id);
    if (!existingPermission) {
      throw new NotFoundError('Permission not found');
    }

    // Check if slug changed and if new slug already exists
    if (data.slug && data.slug !== existingPermission.slug) {
      const slugExists = await this.permissionsRepository.findBySlug(data.slug);
      if (slugExists) {
        throw new ConflictError(`Permission slug '${data.slug}' already exists`);
      }
    }

    // Check if resource/action changed and if new combination already exists
    const newResource = data.resource ?? existingPermission.resource;
    const newAction = data.action ?? existingPermission.action;

    if (newResource !== existingPermission.resource || newAction !== existingPermission.action) {
      const exists = await this.permissionsRepository.exists(newResource, newAction, id);
      if (exists) {
        throw new ConflictError(`Permission already exists for resource '${newResource}' and action '${newAction}'`);
      }
    }

    // Update permission
    return this.permissionsRepository.update(id, data);
  }

  /**
   * Delete permission
   */
  async deletePermission(id: string): Promise<void> {
    // Check if permission exists
    const existingPermission = await this.permissionsRepository.findById(id);
    if (!existingPermission) {
      throw new NotFoundError('Permission not found');
    }

    await this.permissionsRepository.delete(id);
  }
}
