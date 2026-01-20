import { pgTable, bigserial, varchar, text, timestamp, jsonb, integer, boolean, unique, foreignKey, bigint } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { cinemaStatus, roomScreenType, roomSoundType, seatTypeEnum } from "./enums";

export const cinemas = pgTable("cinemas", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 200 }).notNull(),
	code: varchar({ length: 100 }).notNull(),
	slug: varchar({ length: 200 }).notNull(),
	address: text().notNull(),
	city: varchar({ length: 100 }).notNull(),
	district: varchar({ length: 100 }),
	phone: varchar({ length: 20 }),
	email: varchar({ length: 100 }),
	openingHours: jsonb("opening_hours").default([]),
	status: cinemaStatus().default('active'),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("cinemas_code_key").on(table.code),
	unique("cinemas_slug_key").on(table.slug),
]);

export const roomTypes = pgTable("room_types", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	typeName: varchar("type_name", { length: 50 }).notNull(),
	description: text(),
	status: boolean().default(true),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("room_types_type_name_key").on(table.typeName),
]);

export const rooms = pgTable("rooms", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	cinemaId: bigint("cinema_id", { mode: "number" }).notNull(),
	roomTypeId: bigint("room_type_id", { mode: "number" }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	code: varchar({ length: 50 }).notNull(),
	totalSeats: integer("total_seats").default(0).notNull(),
	totalRows: integer("total_rows").notNull(),
	maxSeatsPerRow: integer("max_seats_per_row").notNull(),
	screenSize: roomScreenType("screen_size").default('standard'),
	soundSystem: roomSoundType("sound_system").default('standard'),
	status: integer().default(1),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.cinemaId],
			foreignColumns: [cinemas.id],
			name: "fk_rooms_cinema"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roomTypeId],
			foreignColumns: [roomTypes.id],
			name: "fk_rooms_type"
		}).onDelete("set null"),
]);

export const seatTypes = pgTable("seat_types", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	typeCode: varchar("type_code", { length: 20 }).notNull(),
	typeName: varchar("type_name", { length: 50 }).notNull(),
	description: text(),
	status: boolean().default(true),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("seat_types_type_code_key").on(table.typeCode),
]);

export const roomSeats = pgTable("room_seats", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	roomId: bigint("room_id", { mode: "number" }).notNull(),
	rowNumber: integer("row_number").notNull(),
	seatNumber: integer("seat_number").notNull(),
	seatCode: varchar("seat_code", { length: 10 }).notNull(),
	seatType: seatTypeEnum("seat_type").default('standard'),
	basePrice: text("base_price").default('0').notNull(), // numeric is text in drizzle-orm if precision/scale used
	isAisle: boolean("is_aisle").default(false),
	isAvailable: boolean("is_available").default(true),
	positionX: integer("position_x"),
	positionY: integer("position_y"),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.roomId],
			foreignColumns: [rooms.id],
			name: "fk_room_seats_room"
		}),
	unique("uk_room_seat_position").on(table.roomId, table.rowNumber, table.seatNumber),
	unique("room_seats_seat_code_key").on(table.seatCode),
]);

export const seatLayouts = pgTable("seat_layouts", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	roomId: bigint("room_id", { mode: "number" }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	totalRows: integer("total_rows").notNull(),
	maxSeatsPerRow: integer("max_seats_per_row").notNull(),
	layoutConfig: jsonb("layout_config").default([]),
	isDefault: boolean("is_default").default(false),
	status: boolean().default(true),
	createdBy: varchar("created_by", { length: 100 }),
	updatedBy: varchar("updated_by", { length: 100 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.roomId],
			foreignColumns: [rooms.id],
			name: "seat_layouts_room_id_fkey"
		}).onDelete("cascade"),
]);

export const seatLayoutItems = pgTable("seat_layout_items", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	seatLayoutId: bigint("seat_layout_id", { mode: "number" }).notNull(),
	rowNumber: integer("row_number").notNull(),
	seatNumber: integer("seat_number").notNull(),
	seatCode: varchar("seat_code", { length: 10 }).notNull(),
	seatType: seatTypeEnum("seat_type").default('standard'),
	isDisabled: boolean("is_disabled").default(false),
	isWheelchairAccessible: boolean("is_wheelchair_accessible").default(false),
	isAisle: boolean("is_aisle").default(false),
	isAvailable: boolean("is_available").default(true),
	positionX: integer("position_x"),
	positionY: integer("position_y"),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.seatLayoutId],
			foreignColumns: [seatLayouts.id],
			name: "seat_layout_items_seat_layout_id_fkey"
		}).onDelete("cascade"),
]);

export const seatHoldConfig = pgTable("seat_hold_config", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	holdDurationMinutes: integer("hold_duration_minutes").default(15),
	maxHoldPerUser: integer("max_hold_per_user").default(10),
	autoReleaseEnabled: boolean("auto_release_enabled").default(true),
	releaseBatchSize: integer("release_batch_size").default(100),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
});
