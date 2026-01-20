import { pgTable, uuid, varchar, integer, jsonb, text, timestamp, bigserial, boolean, index, foreignKey, primaryKey, serial, smallint, bigint, unique } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { bookings } from "./booking.model";

export const auditLogs = pgTable("audit_logs", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	entityType: varchar("entity_type", { length: 50 }).notNull(),
	entityId: integer("entity_id").notNull(),
	action: varchar({ length: 50 }).notNull(),
	oldData: jsonb("old_data"),
	newData: jsonb("new_data"),
	userId: integer("user_id"),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_audit_action").on(table.action),
	index("idx_audit_created_at").on(table.createdAt),
	index("idx_audit_entity").on(table.entityType, table.entityId),
	index("idx_audit_user").on(table.userId),
]);

export const cimSqlError = pgTable("cim_sql_error", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	tableName: varchar("table_name", { length: 200 }),
	operation: varchar({ length: 50 }),
	errorMessage: text("error_message"),
	payload: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const cimSqlLog = pgTable("cim_sql_log", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	requestId: uuid("request_id"),
	method: varchar({ length: 10 }),
	url: text(),
	statusCode: integer("status_code"),
	sqlText: text("sql_text"),
	sqlParams: jsonb("sql_params"),
	operation: varchar({ length: 50 }),
	durationMs: bigint("duration_ms", { mode: 'number' }),
	executedBy: varchar("executed_by", { length: 100 }),
	userId: varchar("user_id", { length: 100 }).default(sql`NULL`),
	module: varchar({ length: 100 }),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	payload: jsonb(),
	responseData: jsonb("response_data"),
	isError: boolean("is_error").default(false),
	message: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_sql_created_at").on(table.createdAt),
	index("idx_sql_error").on(table.isError),
	index("idx_sql_op").on(table.operation),
	index("idx_sql_user").on(table.userId),
	index("idx_sql_request_id").on(table.requestId),
]);

export const cimSqlLogDb = pgTable("cim_sql_log_db", {
	sysId: uuid("sys_id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	sysTs: timestamp("sys_ts", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	sysOp: varchar("sys_op", { length: 20 }).notNull(),
	tableName: varchar("table_name", { length: 200 }).notNull(),
	operation: varchar({ length: 50 }).notNull(),
	oldData: jsonb("old_data"),
	newData: jsonb("new_data"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const bookingLogs = pgTable("booking_logs", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	bookingId: bigint("booking_id", { mode: "number" }).notNull(),
	logType: varchar("log_type", { length: 50 }),
	oldValue: text("old_value"),
	newValue: text("new_value"),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_booking_logs_booking_id").on(table.bookingId),
	index("idx_booking_logs_created_at").on(table.createdAt),
	index("idx_booking_logs_log_type").on(table.logType),
	foreignKey({
			columns: [table.bookingId],
			foreignColumns: [bookings.id],
			name: "fk_booking_log_booking"
		}),
]);

export const migrations = pgTable("migrations", {
	id: serial().primaryKey().notNull(),
	migration: varchar({ length: 255 }).notNull(),
	batch: integer().notNull(),
});

export const cache = pgTable("cache", {
	key: varchar({ length: 255 }).primaryKey().notNull(),
	value: text().notNull(),
	expiration: integer().notNull(),
});

export const cacheLocks = pgTable("cache_locks", {
	key: varchar({ length: 255 }).primaryKey().notNull(),
	owner: varchar({ length: 255 }).notNull(),
	expiration: integer().notNull(),
});

export const jobs = pgTable("jobs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	queue: varchar({ length: 255 }).notNull(),
	payload: text().notNull(),
	attempts: smallint().notNull(),
	reservedAt: integer("reserved_at"),
	availableAt: integer("available_at").notNull(),
	createdAt: integer("created_at").notNull(),
}, (table) => [
	index().on(table.queue),
]);

export const jobBatches = pgTable("job_batches", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	totalJobs: integer("total_jobs").notNull(),
	pendingJobs: integer("pending_jobs").notNull(),
	failedJobs: integer("failed_jobs").notNull(),
	failedJobIds: text("failed_job_ids").notNull(),
	options: text(),
	cancelledAt: integer("cancelled_at"),
	createdAt: integer("created_at").notNull(),
	finishedAt: integer("finished_at"),
});

export const failedJobs = pgTable("failed_jobs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: varchar({ length: 255 }).notNull(),
	connection: text().notNull(),
	queue: text().notNull(),
	payload: text().notNull(),
	exception: text().notNull(),
	failedAt: timestamp("failed_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("failed_jobs_uuid_unique").on(table.uuid),
]);

export const telescopeEntries = pgTable("telescope_entries", {
	sequence: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().notNull(),
	batchId: uuid("batch_id").notNull(),
	familyHash: varchar("family_hash", { length: 255 }),
	shouldDisplayOnIndex: boolean("should_display_on_index").default(true).notNull(),
	type: varchar({ length: 20 }).notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
}, (table) => [
	index().on(table.batchId),
	index().on(table.createdAt),
	index().on(table.familyHash),
	index().on(table.type, table.shouldDisplayOnIndex),
	unique("telescope_entries_uuid_unique").on(table.uuid),
]);

export const telescopeMonitoring = pgTable("telescope_monitoring", {
	tag: varchar({ length: 255 }).primaryKey().notNull(),
});

export const telescopeEntriesTags = pgTable("telescope_entries_tags", {
	entryUuid: uuid("entry_uuid").notNull(),
	tag: varchar({ length: 255 }).notNull(),
}, (table) => [
	index().on(table.tag),
	foreignKey({
			columns: [table.entryUuid],
			foreignColumns: [telescopeEntries.uuid],
			name: "telescope_entries_tags_entry_uuid_foreign"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.entryUuid, table.tag], name: "telescope_entries_tags_pkey"}),
]);
