import { db, permissions, Permission, NewPermission } from '@/db';
import { eq, and, ne, desc, sql } from 'drizzle-orm';

/**
 * Permissions Repository
 *
 * Handles all database operations for Permission entity using Drizzle ORM.
 */
export class PermissionsRepository {
  /**
   * Find permission by ID
   */
  async findById(id: string): Promise<Permission | null> {
    const result = await db.select().from(permissions).where(eq(permissions.id, BigInt(id))).limit(1);
    return result[0] || null;
  }

  /**
   * Find permission by name
   */
  async findByName(name: string): Promise<Permission | null> {
    const result = await db.select().from(permissions).where(eq(permissions.name, name)).limit(1);
    return result[0] || null;
  }

  /**
   * Find permission by slug
   */
  async findBySlug(slug: string): Promise<Permission | null> {
    const result = await db.select().from(permissions).where(eq(permissions.slug, slug)).limit(1);
    return result[0] || null;
  }

  /**
   * Find all permissions with pagination
   */
  async findAll(skip = 0, take = 10): Promise<Permission[]> {
    return db.select().from(permissions).orderBy(desc(permissions.createdAt)).offset(skip).limit(take);
  }

  /**
   * Create new permission
   */
  async create(data: NewPermission): Promise<Permission> {
    try {
      const result = await db.insert(permissions).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('❌ PermissionsRepository.create Error:', error);
      throw error;
    }
  }

  /**
   * Update permission
   */
  async update(id: string, data: Partial<NewPermission>): Promise<Permission> {
    try {
      const result = await db
        .update(permissions)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(permissions.id, BigInt(id)))
        .returning();

      if (!result[0]) {
        throw new Error(`Permission with ID ${id} not found`);
      }
      return result[0];
    } catch (error) {
      console.error(`❌ PermissionsRepository.update Error [ID: ${id}]:`, error);
      throw error;
    }
  }

  /**
   * Delete permission
   */
  async delete(id: string): Promise<Permission> {
    try {
      const result = await db.delete(permissions).where(eq(permissions.id, BigInt(id))).returning();
      if (!result[0]) {
        throw new Error(`Permission with ID ${id} not found`);
      }
      return result[0];
    } catch (error) {
      console.error(`❌ PermissionsRepository.delete Error [ID: ${id}]:`, error);
      throw error;
    }
  }

  /**
   * Count total permissions
   */
  async count(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(permissions);
    return Number(result[0].count);
  }

  /**
   * Check if resource-action combination exists
   */
  async exists(resource: string, action: string, excludeId?: string): Promise<boolean> {
    const whereClause = excludeId 
      ? and(eq(permissions.resource, resource), eq(permissions.action, action), ne(permissions.id, BigInt(excludeId))) 
      : and(eq(permissions.resource, resource), eq(permissions.action, action));

    const result = await db.select({ id: permissions.id }).from(permissions).where(whereClause).limit(1);
    return result.length > 0;
  }
}
