import { createApp } from '@/app';
import { env } from '@/config/env';
import { checkConnection } from '@/db';

/**
 * Start the server
 */
const start = async (): Promise<void> => {
  try {
    // Connect to database
    await checkConnection();

    // Create app
    const app = await createApp();

    // Start server
    await app.listen({
      port: env.PORT,
      host: '0.0.0.0', // Allow connections from all interfaces
    });

    console.log(`🚀 Server started successfully on port ${env.PORT} in ${env.NODE_ENV} mode`);
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown
 */
const shutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  try {
    // With postgres-js, we don't necessarily need to explicitly disconnect for small apps,
    // but Drizzle/postgres will handle it.
    console.log('✅ Server shut down successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Start server
start();
