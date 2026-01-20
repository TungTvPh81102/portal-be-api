import jwt from 'jsonwebtoken';
import { env } from '@/config/env';

/**
 * JWT Payload interface
 */
export interface JwtPayload {
  userId: string;
  email: string;
  [key: string]: unknown;
}

/**
 * Generate JWT token (Access Token)
 *
 * @param payload - Data to encode in token
 * @returns JWT token string
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

/**
 * Generate Refresh Token
 *
 * @param payload - Data to encode in token
 * @returns JWT token string
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
  const secret = env.JWT_REFRESH_SECRET || env.JWT_SECRET;
  return jwt.sign(payload, secret, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
};

/**
 * Verify and decode JWT token
 *
 * @param token - JWT token to verify
 * @returns Decoded payload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Verify and decode Refresh Token
 *
 * @param token - Refresh token to verify
 * @returns Decoded payload
 * @throws Error if token is invalid or expired
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  const secret = env.JWT_REFRESH_SECRET || env.JWT_SECRET;
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
};

/**
 * Decode JWT token without verification (use with caution)
 *
 * @param token - JWT token to decode
 * @returns Decoded payload or null
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};
