import { pgTable, bigserial, varchar, bigint, numeric, timestamp, text, index, unique, foreignKey, boolean, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { transactionStatusEnum } from "./enums";
import { bookings } from "./booking.model";
import { users } from "./user.model";

export const paymentMethods = pgTable("payment_methods", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	methodCode: varchar("method_code", { length: 50 }).notNull(),
	methodName: varchar("method_name", { length: 100 }).notNull(),
	methodType: varchar("method_type", { length: 50 }),
	isActive: boolean("is_active").default(true),
}, (table) => [
	unique("payment_methods_method_code_key").on(table.methodCode),
]);

export const transactions = pgTable("transactions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	bookingId: bigint("booking_id", { mode: "number" }).notNull(),
	userId: bigint("user_id", { mode: "number" }).notNull(),
	transactionCode: varchar("transaction_code", { length: 50 }).notNull(),
	paymentMethodId: bigint("payment_method_id", { mode: "number" }).notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	transactionFee: numeric("transaction_fee", { precision: 10, scale:  2 }).default('0'),
	finalAmount: numeric("final_amount", { precision: 10, scale:  2 }).notNull(),
	transactionStatus: transactionStatusEnum("transaction_status").default('pending'),
	transactionDate: timestamp("transaction_date", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	completedDate: timestamp("completed_date", { withTimezone: true, mode: 'string' }),
	gatewayTransactionId: varchar("gateway_transaction_id", { length: 100 }),
	gatewayResponse: text("gateway_response"),
	notes: text(),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_transactions_booking_id").on(table.bookingId),
	index("idx_transactions_date").on(table.transactionDate),
	index("idx_transactions_gateway_id").on(table.gatewayTransactionId),
	index("idx_transactions_status").on(table.transactionStatus),
	index("idx_transactions_user_id").on(table.userId),
	foreignKey({
			columns: [table.bookingId],
			foreignColumns: [bookings.id],
			name: "fk_transaction_booking"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_transaction_user"
		}),
	unique("transactions_transaction_code_key").on(table.transactionCode),
]);

export const transactionLogs = pgTable("transaction_logs", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	transactionId: bigint("transaction_id", { mode: "number" }).notNull(),
	oldStatus: varchar("old_status", { length: 50 }),
	newStatus: varchar("new_status", { length: 50 }),
	changedBy: varchar("changed_by", { length: 100 }),
	changeReason: text("change_reason"),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_transaction_logs_created_at").on(table.createdAt),
	index("idx_transaction_logs_transaction_id").on(table.transactionId),
	foreignKey({
			columns: [table.transactionId],
			foreignColumns: [transactions.id],
			name: "fk_log_transaction"
		}),
]);
