import { pgTable, foreignKey, unique, bigserial, bigint, varchar, numeric, timestamp, text, boolean, jsonb, integer, date, index, uuid, time, uniqueIndex, serial, smallint, primaryKey, inet, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const bookingStatusEnum = pgEnum("booking_status_enum", ['pending', 'confirmed', 'cancelled', 'expired'])
export const cinemaStatus = pgEnum("cinema_status", ['active', 'inactive', 'maintenance'])
export const genderTypeEnum = pgEnum("gender_type_enum", ['male', 'female', 'other', 'not_specified'])
export const movieStatusEnum = pgEnum("movie_status_enum", ['coming_soon', 'now_showing', 'ended'])
export const roomScreenType = pgEnum("room_screen_type", ['standard', 'imax', '4k', 'other'])
export const roomSoundType = pgEnum("room_sound_type", ['standard', 'dts', 'other'])
export const seatTypeEnum = pgEnum("seat_type_enum", ['standard', 'vip', 'premium', 'couple', 'sweetbox', 'wheelchair'])
export const showtimeSeatStatusEnum = pgEnum("showtime_seat_status_enum", ['available', 'hold', 'sold', 'blocked'])
export const showtimeStatusEnum = pgEnum("showtime_status_enum", ['active', 'cancelled', 'ended', 'sold_out'])
export const ticketStatusEnum = pgEnum("ticket_status_enum", ['valid', 'used', 'cancelled'])
export const transactionStatusEnum = pgEnum("transaction_status_enum", ['pending', 'processing', 'success', 'failed', 'cancelled'])


export const bookingItems = pgTable("booking_items", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	bookingId: bigint("booking_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	showtimeSeatId: bigint("showtime_seat_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	seatTypeId: bigint("seat_type_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roomSeatId: bigint("room_seat_id", { mode: "number" }).notNull(),
	seatCode: varchar("seat_code", { length: 10 }).notNull(),
	seatType: seatTypeEnum("seat_type").notNull(),
	originalPrice: numeric("original_price", { precision: 10, scale:  2 }).notNull(),
	discountAmount: numeric("discount_amount", { precision: 10, scale:  2 }).default('0'),
	finalPrice: numeric("final_price", { precision: 10, scale:  2 }).notNull(),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.bookingId],
			foreignColumns: [bookings.id],
			name: "fk_booking_item_booking"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roomSeatId],
			foreignColumns: [roomSeats.id],
			name: "fk_booking_item_room_seat"
		}),
	foreignKey({
			columns: [table.seatTypeId],
			foreignColumns: [seatTypes.id],
			name: "fk_booking_item_seat_type"
		}),
	foreignKey({
			columns: [table.showtimeSeatId],
			foreignColumns: [showtimeSeats.id],
			name: "fk_booking_item_showtime_seat"
		}),
	unique("uk_booking_showtime_seat").on(table.bookingId, table.showtimeSeatId),
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

export const rooms = pgTable("rooms", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	cinemaId: bigint("cinema_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
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

export const seatLayouts = pgTable("seat_layouts", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
	code: varchar({ length: 50 }).default(').notNull(),
}, (table) => [
	unique("users_email_key").on(table.email),
	unique("users_phone_key").on(table.phone),
	unique("users_code_unique").on(table.code),
]);

export const tickets = pgTable("tickets", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	code: varchar({ length: 30 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	bookingId: bigint("booking_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	bookingItemId: bigint("booking_item_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	showtimeId: bigint("showtime_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roomSeatId: bigint("room_seat_id", { mode: "number" }).notNull(),
	seatCode: varchar("seat_code", { length: 10 }).notNull(),
	qrCode: text("qr_code"),
	barcode: varchar({ length: 100 }),
	ticketStatus: ticketStatusEnum("ticket_status").default('valid'),
	usedAt: timestamp("used_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
}, (table) => [
	index("idx_ticket_booking_id").using("btree", table.bookingId.asc().nullsLast().op("int8_ops")),
	index("idx_ticket_qr_hash").using("btree", sql`md5(qr_code)`),
	index("idx_ticket_showtime_id").using("btree", table.showtimeId.asc().nullsLast().op("int8_ops")),
	index("idx_ticket_status").using("btree", table.ticketStatus.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.bookingId],
			foreignColumns: [bookings.id],
			name: "fk_ticket_booking"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.bookingItemId],
			foreignColumns: [bookingItems.id],
			name: "fk_ticket_booking_item"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roomSeatId],
			foreignColumns: [roomSeats.id],
			name: "fk_ticket_room_seat"
		}),
	foreignKey({
			columns: [table.showtimeId],
			foreignColumns: [showtimes.id],
			name: "fk_ticket_showtime"
		}),
	unique("tickets_code_key").on(table.code),
]);

export const transactions = pgTable("transactions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	bookingId: bigint("booking_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	transactionCode: varchar("transaction_code", { length: 50 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
	index("idx_transactions_booking_id").using("btree", table.bookingId.asc().nullsLast().op("int8_ops")),
	index("idx_transactions_date").using("btree", table.transactionDate.asc().nullsLast().op("timestamptz_ops")),
	index("idx_transactions_gateway_id").using("btree", table.gatewayTransactionId.asc().nullsLast().op("text_ops")),
	index("idx_transactions_status").using("btree", table.transactionStatus.asc().nullsLast().op("enum_ops")),
	index("idx_transactions_user_id").using("btree", table.userId.asc().nullsLast().op("int8_ops")),
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
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
	index("idx_transaction_logs_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_transaction_logs_transaction_id").using("btree", table.transactionId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.transactionId],
			foreignColumns: [transactions.id],
			name: "fk_log_transaction"
		}),
]);

export const paymentMethods = pgTable("payment_methods", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	methodCode: varchar("method_code", { length: 50 }).notNull(),
	methodName: varchar("method_name", { length: 100 }).notNull(),
	methodType: varchar("method_type", { length: 50 }),
	isActive: boolean("is_active").default(true),
}, (table) => [
	unique("payment_methods_method_code_key").on(table.methodCode),
]);

export const roomSeats = pgTable("room_seats", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roomId: bigint("room_id", { mode: "number" }).notNull(),
	rowNumber: integer("row_number").notNull(),
	seatNumber: integer("seat_number").notNull(),
	seatCode: varchar("seat_code", { length: 10 }).notNull(),
	seatType: seatTypeEnum("seat_type").default('standard'),
	basePrice: numeric("base_price", { precision: 10, scale:  2 }).default('0').notNull(),
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
	index("idx_room_available").using("btree", table.roomId.asc().nullsLast().op("int8_ops"), table.isAvailable.asc().nullsLast().op("bool_ops")),
	index("idx_seat_type").using("btree", table.seatType.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.roomId],
			foreignColumns: [rooms.id],
			name: "fk_room_seats_room"
		}),
	unique("uk_room_seat_position").on(table.roomId, table.rowNumber, table.seatNumber),
	unique("room_seats_seat_code_key").on(table.seatCode),
]);

export const genres = pgTable("genres", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 50 }).notNull(),
	nameEn: varchar("name_en", { length: 50 }),
	description: text(),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_genre_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
	unique("genres_name_key").on(table.name),
]);

export const movies = pgTable("movies", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	code: varchar({ length: 200 }).notNull(),
	title: varchar({ length: 300 }).notNull(),
	titleEn: varchar("title_en", { length: 300 }),
	description: text(),
	director: varchar({ length: 200 }),
	cast: text(),
	durationMinutes: integer("duration_minutes").notNull(),
	releaseDate: date("release_date").notNull(),
	endDate: date("end_date"),
	rating: varchar().default('T18'),
	language: varchar({ length: 50 }).default('vietnamese'),
	subtitleLanguage: varchar("subtitle_language", { length: 50 }),
	posterUrl: varchar("poster_url", { length: 500 }).default(sql`NULL`),
	trailerUrl: varchar("trailer_url", { length: 500 }).default(sql`NULL`),
	bannerUrl: varchar("banner_url", { length: 500 }).default(sql`NULL`),
	status: movieStatusEnum().default('coming_soon'),
	is3D: boolean("is_3d").default(false),
	isImax: boolean("is_imax").default(false),
	isActive: boolean("is_active").default(true),
	viewsCount: integer("views_count").default(0),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_movies_status_release").using("btree", table.status.asc().nullsLast().op("enum_ops"), table.releaseDate.asc().nullsLast().op("date_ops")),
	index("idx_movies_title").using("btree", table.title.asc().nullsLast().op("text_ops")),
	unique("movies_code_key").on(table.code),
]);

export const bookingLogs = pgTable("booking_logs", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
	index("idx_booking_logs_booking_id").using("btree", table.bookingId.asc().nullsLast().op("int8_ops")),
	index("idx_booking_logs_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_booking_logs_log_type").using("btree", table.logType.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.bookingId],
			foreignColumns: [bookings.id],
			name: "fk_booking_log_booking"
		}),
]);

export const movieRatings = pgTable("movie_ratings", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	code: varchar({ length: 10 }).notNull(),
	name: varchar({ length: 50 }).notNull(),
	description: text(),
	minAge: integer("min_age"),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("movie_ratings_code_key").on(table.code),
]);

export const movieGenreMapping = pgTable("movie_genre_mapping", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	movieId: bigint("movie_id", { mode: "number" }).notNull(),
	genreId: integer("genre_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.genreId],
			foreignColumns: [genres.id],
			name: "fk_movie_genre_genre"
		}),
	foreignKey({
			columns: [table.movieId],
			foreignColumns: [movies.id],
			name: "fk_movie_genre_movie"
		}).onDelete("cascade"),
	unique("uk_movie_genre").on(table.movieId, table.genreId),
]);

export const bookings = pgTable("bookings", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	code: varchar({ length: 200 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	showtimeId: bigint("showtime_id", { mode: "number" }).notNull(),
	totalSeats: integer("total_seats").notNull(),
	subtotal: numeric({ precision: 10, scale:  2 }).notNull(),
	discountAmount: numeric("discount_amount", { precision: 10, scale:  2 }).default('0'),
	taxAmount: numeric("tax_amount", { precision: 10, scale:  2 }).default('0'),
	totalAmount: numeric("total_amount", { precision: 10, scale:  2 }).notNull(),
	finalPrice: numeric("final_price", { precision: 10, scale:  2 }).notNull(),
	voucherCode: varchar("voucher_code", { length: 100 }).default(sql`NULL`),
	status: bookingStatusEnum().default('pending'),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	customerName: varchar("customer_name", { length: 200 }),
	customerPhone: varchar("customer_phone", { length: 20 }).default(sql`NULL`),
	customerEmail: varchar("customer_email", { length: 255 }),
	isPaid: boolean("is_paid").default(false),
	paymentMethodId: varchar("payment_method_id", { length: 20 }).default(sql`NULL`),
	notes: text(),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_bookings_code").using("btree", table.code.asc().nullsLast().op("text_ops")),
	index("idx_bookings_expires").using("btree", table.expiresAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_bookings_showtime").using("btree", table.showtimeId.asc().nullsLast().op("int8_ops")),
	index("idx_bookings_status_created").using("btree", table.status.asc().nullsLast().op("enum_ops"), table.createdAt.asc().nullsLast().op("enum_ops")),
	index("idx_bookings_user_status").using("btree", table.userId.asc().nullsLast().op("enum_ops"), table.status.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.showtimeId],
			foreignColumns: [showtimes.id],
			name: "fk_booking_showtime"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_booking_user"
		}),
	unique("bookings_code_key").on(table.code),
]);

export const showtimes = pgTable("showtimes", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	movieId: bigint("movie_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roomId: bigint("room_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	formatId: bigint("format_id", { mode: "number" }).notNull(),
	showtimeDate: date("showtime_date").notNull(),
	startTime: time("start_time").notNull(),
	endTime: time("end_time").notNull(),
	language: varchar({ length: 200 }).default('vietnamese'),
	basePrice: numeric("base_price", { precision: 10, scale:  2 }).notNull(),
	isPremiere: boolean("is_premiere").default(false),
	isHoliday: boolean("is_holiday").default(false),
	availableSeats: integer("available_seats"),
	bookedSeats: integer("booked_seats").default(0),
	heldSeats: integer("held_seats").default(0),
	soldSeats: integer("sold_seats").default(0),
	status: showtimeStatusEnum().default('active'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.formatId],
			foreignColumns: [movieFormats.id],
			name: "fk_showtime_format"
		}),
	foreignKey({
			columns: [table.movieId],
			foreignColumns: [movies.id],
			name: "fk_showtime_movie"
		}),
	foreignKey({
			columns: [table.roomId],
			foreignColumns: [rooms.id],
			name: "fk_showtime_room"
		}),
	unique("uk_room_time_slot").on(table.roomId, table.showtimeDate, table.startTime),
]);

export const movieFormats = pgTable("movie_formats", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	code: varchar({ length: 20 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	status: boolean().default(true),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("movie_formats_code_key").on(table.code),
]);

export const showtimeSeats = pgTable("showtime_seats", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	showtimeId: bigint("showtime_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roomSeatId: bigint("room_seat_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	bookingId: bigint("booking_id", { mode: "number" }),
	status: showtimeSeatStatusEnum().default('available'),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_showtime_seats_booking").using("btree", table.bookingId.asc().nullsLast().op("int8_ops")),
	index("idx_showtime_seats_showtime_status").using("btree", table.showtimeId.asc().nullsLast().op("enum_ops"), table.status.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.bookingId],
			foreignColumns: [bookings.id],
			name: "fk_showtime_seat_booking"
		}),
	foreignKey({
			columns: [table.roomSeatId],
			foreignColumns: [roomSeats.id],
			name: "fk_showtime_seat_roomseat"
		}),
	foreignKey({
			columns: [table.showtimeId],
			foreignColumns: [showtimes.id],
			name: "fk_showtime_seat_showtime"
		}),
	unique("uk_showtime_seat").on(table.showtimeId, table.roomSeatId),
]);

export const cimSqlError = pgTable("cim_sql_error", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	tableName: varchar("table_name", { length: 200 }),
	operation: varchar({ length: 50 }),
	errorMessage: text("error_message"),
	payload: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

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
	index("idx_audit_action").using("btree", table.action.asc().nullsLast().op("text_ops")),
	index("idx_audit_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_audit_entity").using("btree", table.entityType.asc().nullsLast().op("text_ops"), table.entityId.asc().nullsLast().op("int4_ops")),
	index("idx_audit_user").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
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

export const cimSqlLog = pgTable("cim_sql_log", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	sqlText: text("sql_text").notNull(),
	sqlParams: jsonb("sql_params"),
	operation: varchar({ length: 50 }),
	durationMs: varchar("duration_ms"),
	executedBy: varchar("executed_by", { length: 100 }),
	userId: varchar("user_id", { length: 100 }).default(sql`NULL`),
	module: varchar({ length: 100 }),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	isError: boolean("is_error").default(false),
	message: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_sql_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_sql_error").using("btree", table.isError.asc().nullsLast().op("bool_ops")),
	index("idx_sql_op").using("btree", table.operation.asc().nullsLast().op("text_ops")),
	index("idx_sql_user").using("btree", table.userId.asc().nullsLast().op("text_ops")),
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

export const rolePermissions = pgTable("role_permissions", {
	roleId: bigserial("role_id", { mode: "bigint" }).notNull(),
	permissionId: bigserial("permission_id", { mode: "bigint" }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_role_perms_perm").using("btree", table.permissionId.asc().nullsLast().op("int8_ops")),
	index("idx_role_perms_role").using("btree", table.roleId.asc().nullsLast().op("int8_ops")),
	uniqueIndex("idx_role_perms_unique").using("btree", table.roleId.asc().nullsLast().op("int8_ops"), table.permissionId.asc().nullsLast().op("int8_ops")),
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

export const migrations = pgTable("migrations", {
	id: serial().primaryKey().notNull(),
	migration: varchar({ length: 255 }).notNull(),
	batch: integer().notNull(),
});

export const cacheLocks = pgTable("cache_locks", {
	key: varchar({ length: 255 }).primaryKey().notNull(),
	owner: varchar({ length: 255 }).notNull(),
	expiration: integer().notNull(),
});

export const cache = pgTable("cache", {
	key: varchar({ length: 255 }).primaryKey().notNull(),
	value: text().notNull(),
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
	index().using("btree", table.queue.asc().nullsLast().op("text_ops")),
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
	index().using("btree", table.batchId.asc().nullsLast().op("uuid_ops")),
	index().using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index().using("btree", table.familyHash.asc().nullsLast().op("text_ops")),
	index().using("btree", table.type.asc().nullsLast().op("text_ops"), table.shouldDisplayOnIndex.asc().nullsLast().op("text_ops")),
	unique("telescope_entries_uuid_unique").on(table.uuid),
]);

export const telescopeMonitoring = pgTable("telescope_monitoring", {
	tag: varchar({ length: 255 }).primaryKey().notNull(),
});

export const sessions = pgTable("sessions", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	payload: text().notNull(),
	lastActivity: integer("last_activity").notNull(),
}, (table) => [
	index().using("btree", table.lastActivity.asc().nullsLast().op("int4_ops")),
	index().using("btree", table.userId.asc().nullsLast().op("int8_ops")),
]);

export const telescopeEntriesTags = pgTable("telescope_entries_tags", {
	entryUuid: uuid("entry_uuid").notNull(),
	tag: varchar({ length: 255 }).notNull(),
}, (table) => [
	index().using("btree", table.tag.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.entryUuid],
			foreignColumns: [telescopeEntries.uuid],
			name: "telescope_entries_tags_entry_uuid_foreign"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.entryUuid, table.tag], name: "telescope_entries_tags_pkey"}),
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
