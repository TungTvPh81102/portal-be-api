import { pgTable, text, timestamp, uuid, unique } from 'drizzle-orm/pg-core';

export const permissions = pgTable(
  'permissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').unique().notNull(),
    description: text('description'),
    resource: text('resource').notNull(),
    action: text('action').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    unique('permissions_resource_action_unique').on(table.resource, table.action),
  ]
);

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
