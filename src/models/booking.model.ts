import { pgTable, bigserial, varchar, bigint, integer, numeric, timestamp, time, date, boolean, text, index, unique, foreignKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { bookingStatusEnum, seatTypeEnum, ticketStatusEnum, showtimeStatusEnum, showtimeSeatStatusEnum } from "./enums";
import { users } from "./user.model";
import { rooms, roomSeats, seatTypes } from "./cinema.model";
import { movies, movieFormats } from "./movie.model";

export const bookings = pgTable("bookings", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	code: varchar({ length: 200 }).notNull(),
	userId: bigint("user_id", { mode: "number" }).notNull(),
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
	index("idx_bookings_code").on(table.code),
	index("idx_bookings_expires").on(table.expiresAt),
	index("idx_bookings_showtime").on(table.showtimeId),
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
	movieId: bigint("movie_id", { mode: "number" }).notNull(),
	roomId: bigint("room_id", { mode: "number" }).notNull(),
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

export const showtimeSeats = pgTable("showtime_seats", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	showtimeId: bigint("showtime_id", { mode: "number" }).notNull(),
	roomSeatId: bigint("room_seat_id", { mode: "number" }).notNull(),
	bookingId: bigint("booking_id", { mode: "number" }),
	status: showtimeSeatStatusEnum().default('available'),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	createdBy: varchar("created_by", { length: 100 }).default(sql`NULL`),
	updatedBy: varchar("updated_by", { length: 100 }).default(sql`NULL`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_showtime_seats_booking").on(table.bookingId),
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

export const bookingItems = pgTable("booking_items", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	bookingId: bigint("booking_id", { mode: "number" }).notNull(),
	showtimeSeatId: bigint("showtime_seat_id", { mode: "number" }).notNull(),
	seatTypeId: bigint("seat_type_id", { mode: "number" }).notNull(),
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

export const tickets = pgTable("tickets", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	code: varchar({ length: 30 }).notNull(),
	bookingId: bigint("booking_id", { mode: "number" }).notNull(),
	bookingItemId: bigint("booking_item_id", { mode: "number" }).notNull(),
	showtimeId: bigint("showtime_id", { mode: "number" }).notNull(),
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
	index("idx_ticket_booking_id").on(table.bookingId),
	index("idx_ticket_showtime_id").on(table.showtimeId),
	index("idx_ticket_status").on(table.ticketStatus),
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
