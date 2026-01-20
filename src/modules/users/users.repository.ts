import { db, users, User, NewUser } from '@/db';
import { eq, and, ne, desc, sql } from 'drizzle-orm';

/**
 * Users Repository
 *
 * Handles all database operations for User entity using Drizzle ORM.
 * NO business logic - only database queries.
 */
export class UsersRepository {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, BigInt(id))).limit(1);
    return result[0] || null;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  }

  /**
   * Find all users with pagination
   */
  async findAll(skip = 0, take = 10): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt)).offset(skip).limit(take);
  }

  /**
   * Create new user
   */
  async create(data: NewUser): Promise<User> {
    try {
      const result = await db.insert(users).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('❌ UsersRepository.create Error:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async update(id: string, data: Partial<NewUser>): Promise<User> {
    try {
      const result = await db
        .update(users)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(users.id, BigInt(id)))
        .returning();

      if (!result[0]) {
        throw new Error(`User with ID ${id} not found`);
      }
      return result[0];
    } catch (error) {
      console.error(`❌ UsersRepository.update Error [ID: ${id}]:`, error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<User> {
    try {
      const result = await db.delete(users).where(eq(users.id, BigInt(id))).returning();
      if (!result[0]) {
        throw new Error(`User with ID ${id} not found`);
      }
      return result[0];
    } catch (error) {
      console.error(`❌ UsersRepository.delete Error [ID: ${id}]:`, error);
      throw error;
    }
  }

  /**
   * Count total users
   */
  async count(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(users);
    return Number(result[0].count);
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const whereClause = excludeId ? and(eq(users.email, email), ne(users.id, BigInt(excludeId))) : eq(users.email, email);

    const result = await db.select({ id: users.id }).from(users).where(whereClause).limit(1);
    return result.length > 0;
  }
}
