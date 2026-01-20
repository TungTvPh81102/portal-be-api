import bcrypt from 'bcryptjs';
import { env } from '@/config/env';

/**
 * Hash a password using bcrypt
 *
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(env.BCRYPT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compare plain text password with hashed password
 *
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
