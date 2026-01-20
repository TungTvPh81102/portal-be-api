import { Client } from 'minio';
import { env } from '@/config/env';

/**
 * MinIO Client Configuration
 */
export const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: env.MINIO_USE_SSL,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

/**
 * Ensure bucket exists, create if not
 */
export const ensureBucket = async (bucketName: string = env.MINIO_BUCKET): Promise<void> => {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName);
      console.log(`✅ MinIO Bucket '${bucketName}' created successfully.`);
    }
  } catch (error) {
    console.error('❌ Error ensuring MinIO bucket exists:', error);
    throw error;
  }
};

export default minioClient;
