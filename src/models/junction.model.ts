import { pgTable, timestamp, uuid, index, unique } from 'drizzle-orm/pg-core';
import { users } from './user.model';
import { roles } from './role.model';
import { permissions } from './permission.model';

/**
 * UserRole Junction Table
 */
export const userRoles = pgTable(
  'user_roles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    unique('user_roles_user_id_role_id_unique').on(table.userId, table.roleId),
    index('user_roles_user_id_idx').on(table.userId),
    index('user_roles_role_id_idx').on(table.roleId),
  ]
);

/**
 * RolePermission Junction Table
 */
export const rolePermissions = pgTable(
  'role_permissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    unique('role_permissions_role_id_permission_id_unique').on(
      table.roleId,
      table.permissionId
    ),
    index('role_permissions_role_id_idx').on(table.roleId),
    index('role_permissions_permission_id_idx').on(table.permissionId),
  ]
);
