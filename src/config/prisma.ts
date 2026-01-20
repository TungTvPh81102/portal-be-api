import { PrismaClient } from '@prisma/client';
import { env } from '@/config/env';

/**
 * Prisma Client singleton instance
 *
 * This ensures only one instance of PrismaClient is created
 * and reused across the application lifecycle.
 */
class PrismaService {
  private static instance: PrismaClient | null = null;

  /**
   * Get or create Prisma Client instance
   */
  static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient({
        log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });

      // Handle graceful shutdown
      process.on('beforeExit', async () => {
        await PrismaService.disconnect();
      });
    }

    return PrismaService.instance;
  }

  /**
   * Connect to database
   */
  static async connect(): Promise<void> {
    try {
      const client = PrismaService.getInstance();
      await client.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection error:', error);
      throw error;
    }
  }

  /**
   * Disconnect from database
   */
  static async disconnect(): Promise<void> {
    try {
      if (PrismaService.instance) {
        await PrismaService.instance.$disconnect();
        PrismaService.instance = null;
        console.log('✅ Database disconnected successfully');
      }
    } catch (error) {
      console.error('❌ Database disconnection error:', error);
    }
  }

  /**
   * Get Prisma Client (alias for getInstance)
   */
  static get client(): PrismaClient {
    return PrismaService.getInstance();
  }
}

/**
 * Export singleton Prisma Client instance
 */
export const prisma = PrismaService.getInstance();

/**
 * Export PrismaService for lifecycle management
 */
export default PrismaService;
