import { z } from 'zod';

export const permissionsSchema = {
  getAll: {
    description: 'Get all permissionss',
    tags: ['Permissions'],
    response: {
      200: z.object({
        data: z.array(z.any())
      })
    }
  },
  getById: {
    description: 'Get permissions by ID',
    tags: ['Permissions'],
    params: z.object({
      id: z.string()
    }),
    response: {
      200: z.object({
        data: z.any().nullable()
      })
    }
  }
}