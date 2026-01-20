import { pgTable, bigserial, varchar, date, timestamp, integer, numeric, unique, bigint, text, boolean, index, primaryKey, inet, foreignKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { genderTypeEnum } from "./enums";

export const users = pgTable("users", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }),
	name: varchar({ length: 100 }),
	dateOfBirth: date("date_of_birth"),
	emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true, mode: 'string' }),
	password: varchar({ length: 255 }).notNull(),
	gender: genderTypeEnum().default('not_specified'),
	avatar: varchar({ length: 500 }).default(sql`NULL`),
	membershipTier: varchar("membership_tier", { length: 200 }),
	loyaltyPoints: integer("loyalty_points").default(0),
	totalSpent: numeric("total_spent", { precision: 12, scale:  2 }).default('0'),
	enable: integer().default(1),
	logOnDate: timestamp("log_on_date", { withTimezone: true, mode: 'string' }),
	lockCount: integer("lock_count").default(0),
	lockedAt: timestamp("locked_at", { withTimezone: true, mode: 'string' }),
	createdBy: varchar("created_by", { length: 100 }),
	deletedBy: varchar("deleted_by", { length: 100 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	code: varchar({ length: 50 }).default('').notNull(),
}, (table) => [
	unique("users_email_key").on(table.email),
	unique("users_phone_key").on(table.phone),
	unique("users_code_unique").on(table.code),
]);

export const roles = pgTable("roles", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	slug: varchar({ length: 100 }).notNull(),
	description: text(),
	isSystem: boolean("is_system").default(false).notNull(),
	level: integer().default(0).notNull(),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	deletedBy: varchar("deleted_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("roles_name_key").on(table.name),
	unique("roles_slug_key").on(table.slug),
]);

export const permissions = pgTable("permissions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	slug: varchar({ length: 100 }).notNull(),
	resource: varchar({ length: 50 }).notNull(),
	action: varchar({ length: 50 }).notNull(),
	description: text(),
	isSystem: boolean("is_system").default(true).notNull(),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("permissions_slug_key").on(table.slug),
	unique("permissions_resource_key").on(table.resource),
]);

export const userRoles = pgTable("user_roles", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	userId: bigserial("user_id", { mode: "bigint" }).notNull(),
	roleId: bigserial("role_id", { mode: "bigint" }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "fk_role"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_user"
		}).onDelete("cascade"),
]);

export const rolePermissions = pgTable("role_permissions", {
	roleId: bigserial("role_id", { mode: "bigint" }).notNull(),
	permissionId: bigserial("permission_id", { mode: "bigint" }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_role_perms_perm").using("btree", table.permissionId.asc().nullsLast()),
	index("idx_role_perms_role").using("btree", table.roleId.asc().nullsLast()),
	index("idx_role_perms_unique").using("btree", table.roleId.asc().nullsLast(), table.permissionId.asc().nullsLast()),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [permissions.id],
			name: "fk_permission"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "fk_role"
		}).onDelete("cascade"),
]);

export const sessions = pgTable("sessions", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	userId: bigint("user_id", { mode: "number" }),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	payload: text().notNull(),
	lastActivity: integer("last_activity").notNull(),
}, (table) => [
	index().using("btree", table.lastActivity.asc().nullsLast()),
	index().using("btree", table.userId.asc().nullsLast()),
]);

export const passwordResetTokens = pgTable("password_reset_tokens", {
	email: varchar({ length: 255 }).notNull(),
	token: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	usedAt: timestamp("used_at", { withTimezone: true, mode: 'string' }),
	ipAddress: inet("ip_address"),
	status: integer().default(1),
}, (table) => [
	primaryKey({ columns: [table.email, table.token], name: "password_reset_tokens_pkey"}),
]);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;

