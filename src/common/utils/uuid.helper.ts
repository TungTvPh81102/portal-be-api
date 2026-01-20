import { v4 as uuidv4, validate as uuidValidate, version as uuidVersion } from 'uuid';

/**
 * Generate a new UUID v4
 * @returns UUID string
 */
export const generateUUID = (): string => {
  return uuidv4();
};

/**
 * Validate if a string is a valid UUID v4
 * @param uuid - String to validate
 * @returns true if valid UUID v4, false otherwise
 */
export const isValidUUID = (uuid: string): boolean => {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
};

/**
 * Parse and validate UUID
 * @param uuid - UUID string to parse
 * @returns Validated UUID string
 * @throws Error if invalid UUID
 */
export const parseUUID = (uuid: string): string => {
  if (!isValidUUID(uuid)) {
    throw new Error('Invalid UUID format');
  }
  return uuid;
};

/**
 * Check if value is a valid UUID (any version)
 * @param value - Value to check
 * @returns true if valid UUID
 */
export const isUUID = (value: string): boolean => {
  return uuidValidate(value);
};
