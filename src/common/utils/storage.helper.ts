import { minioClient } from '@/config/minio';
import cloudinary from '@/config/cloudinary';
import { env } from '@/config/env';
import { Readable as ReadableStream } from 'stream';

/**
 * Storage Helper
 * Utilities for file management using MinIO and Cloudinary
 */
export class StorageHelper {
  // ========== MinIO Methods ==========

  /**
   * Upload file to MinIO
   */
  static async uploadToMinio(
    filename: string,
    stream: ReadableStream | Buffer,
    bucketName: string = env.MINIO_BUCKET,
    metaData: Record<string, string> = {}
  ): Promise<string> {
    try {
      await minioClient.putObject(bucketName, filename, stream, undefined, metaData);
      return filename;
    } catch (error) {
      console.error(`❌ MinIO Upload Error [${filename}]:`, error);
      throw error;
    }
  }

  /**
   * Get presigned URL for a file from MinIO
   */
  static async getMinioUrl(
    filename: string,
    bucketName: string = env.MINIO_BUCKET,
    expiry: number = 24 * 60 * 60 // 24 hours
  ): Promise<string> {
    try {
      return await minioClient.presignedGetObject(bucketName, filename, expiry);
    } catch (error) {
      console.error(`❌ MinIO URL Error [${filename}]:`, error);
      throw error;
    }
  }

  /**
   * Delete file from MinIO
   */
  static async deleteFromMinio(
    filename: string,
    bucketName: string = env.MINIO_BUCKET
  ): Promise<void> {
    try {
      await minioClient.removeObject(bucketName, filename);
    } catch (error) {
      console.error(`❌ MinIO Delete Error [${filename}]:`, error);
      throw error;
    }
  }

  // ========== Cloudinary Methods ==========

  /**
   * Upload file to Cloudinary
   */
  static async uploadToCloudinary(
    file: string | Buffer | ReadableStream,
    folder: string = 'portal-uploads'
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
        if (error) {
          console.error('❌ Cloudinary Upload Error:', error);
          return reject(error);
        }
        resolve(result);
      });

      if (Buffer.isBuffer(file)) {
        uploadStream.end(file);
      } else if (typeof file === 'string') {
        cloudinary.uploader.upload(file, { folder }).then(resolve).catch(reject);
      } else {
        file.pipe(uploadStream);
      }
    });
  }

  /**
   * Delete file from Cloudinary
   */
  static async deleteFromCloudinary(publicId: string): Promise<any> {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`❌ Cloudinary Delete Error [${publicId}]:`, error);
      throw error;
    }
  }
}
