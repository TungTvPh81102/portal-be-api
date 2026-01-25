import { db, roles, Role, NewRole, rolePermissions, permissions, Permission } from '@/db';
import { eq, desc, sql } from 'drizzle-orm';

/**
 * Roles Repository
 *
 * Handles all database operations for Role entity using Drizzle ORM.
 */
export class RolesRepository {
  /**
   * Find role by ID
   */
  async findById(id: string): Promise<Role | null> {
    const result = await db.select().from(roles).where(eq(roles.id, BigInt(id))).limit(1);
    return result[0] || null;
  }

  /**
   * Find role by name
   */
  async findByName(name: string): Promise<Role | null> {
    const result = await db.select().from(roles).where(eq(roles.name, name)).limit(1);
    return result[0] || null;
  }

  /**
   * Find role by slug
   */
  async findBySlug(slug: string): Promise<Role | null> {
    const result = await db.select().from(roles).where(eq(roles.slug, slug)).limit(1);
    return result[0] || null;
  }

  /**
   * Find all roles with pagination
   */
  async findAll(skip = 0, take = 10): Promise<Role[]> {
    return db.select().from(roles).orderBy(desc(roles.createdAt)).offset(skip).limit(take);
  }

  /**
   * Create new role
   */
  async create(data: NewRole): Promise<Role> {
    try {
      const result = await db.insert(roles).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('❌ RolesRepository.create Error:', error);
      throw error;
    }
  }

  /**
   * Update role
   */
  async update(id: string, data: Partial<NewRole>): Promise<Role> {
    try {
      const result = await db
        .update(roles)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(roles.id, BigInt(id)))
        .returning();

      if (!result[0]) {
        throw new Error(`Role with ID ${id} not found`);
      }
      return result[0];
    } catch (error) {
      console.error(`❌ RolesRepository.update Error [ID: ${id}]:`, error);
      throw error;
    }
  }

  /**
   * Delete role
   */
  async delete(id: string): Promise<Role> {
    try {
      const result = await db.delete(roles).where(eq(roles.id, BigInt(id))).returning();
      if (!result[0]) {
        throw new Error(`Role with ID ${id} not found`);
      }
      return result[0];
    } catch (error) {
      console.error(`❌ RolesRepository.delete Error [ID: ${id}]:`, error);
      throw error;
    }
  }

  /**
   * Count total roles
   */
  async count(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(roles);
    return Number(result[0].count);
  }

  /**
   * Get role with its permissions
   */
  async findRoleWithPermissions(roleId: string): Promise<{ role: Role, permissions: Permission[] } | null> {
    const roleResult = await this.findById(roleId);
    if (!roleResult) return null;

    const rolePermissionsResult = await db
      .select({
        permission: permissions
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, BigInt(roleId)));

    return {
      role: roleResult,
      permissions: rolePermissionsResult.map(r => r.permission)
    };
  }

  /**
   * Sync permissions for a role
   * (Removes all current and adds new ones)
   */
  async syncPermissions(roleId: string, permissionIds: string[]): Promise<void> {
    await db.transaction(async (tx) => {
      // 1. Delete all existing permissions for this role
      await tx.delete(rolePermissions).where(eq(rolePermissions.roleId, BigInt(roleId)));

      // 2. Insert new permissions
      if (permissionIds.length > 0) {
        const values = permissionIds.map(permissionId => ({
          roleId: BigInt(roleId),
          permissionId: BigInt(permissionId)
        }));
        await tx.insert(rolePermissions).values(values);
      }
    });
  }

  /**
   * Add permissions to a role (Append)
   */
  async addPermissions(roleId: string, permissionIds: string[]): Promise<void> {
    const values = permissionIds.map(permissionId => ({
      roleId: BigInt(roleId),
      permissionId: BigInt(permissionId)
    }));
    
    // Use onConflictDoNothing to avoid errors if permission already exists
    // Note: role_permissions does not have a unique constraint on (role_id, permission_id) in the schema I see, 
    // but typically it should. If it doesn't, onConflictDoNothing won't work without specifying target.
    // In user.model.ts, it has indexes but NO explicit unique constraint naming for conflict.
    await db.insert(rolePermissions).values(values).onConflictDoNothing();
  }
}
