import { z } from 'zod';

export const rolesSchema = {
  getAll: {
    description: 'Get all roless',
    tags: ['Roles'],
    response: {
      200: z.object({
        data: z.array(z.any())
      })
    }
  },
  getById: {
    description: 'Get roles by ID',
    tags: ['Roles'],
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