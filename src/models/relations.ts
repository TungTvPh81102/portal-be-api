import { relations } from "drizzle-orm/relations";
import { bookings, bookingItems, showtimes, showtimeSeats, tickets } from "./booking.model";
import { roomSeats, cinemas, rooms, roomTypes, seatLayouts, seatLayoutItems, seatTypes } from "./cinema.model";
import { movies, genres, movieGenreMapping, movieFormats } from "./movie.model";
import { transactions, transactionLogs } from "./payment.model";
import { users, userRoles, roles, permissions, rolePermissions } from "./user.model";
import { bookingLogs, telescopeEntries, telescopeEntriesTags } from "./system.model";

export const bookingItemsRelations = relations(bookingItems, ({one, many}) => ({
	booking: one(bookings, {
		fields: [bookingItems.bookingId],
		references: [bookings.id]
	}),
	roomSeat: one(roomSeats, {
		fields: [bookingItems.roomSeatId],
		references: [roomSeats.id]
	}),
	seatType: one(seatTypes, {
		fields: [bookingItems.seatTypeId],
		references: [seatTypes.id]
	}),
	showtimeSeat: one(showtimeSeats, {
		fields: [bookingItems.showtimeSeatId],
		references: [showtimeSeats.id]
	}),
	tickets: many(tickets),
}));

export const bookingsRelations = relations(bookings, ({one, many}) => ({
	bookingItems: many(bookingItems),
	tickets: many(tickets),
	transactions: many(transactions),
	bookingLogs: many(bookingLogs),
	showtime: one(showtimes, {
		fields: [bookings.showtimeId],
		references: [showtimes.id]
	}),
	user: one(users, {
		fields: [bookings.userId],
		references: [users.id]
	}),
	showtimeSeats: many(showtimeSeats),
}));

export const roomSeatsRelations = relations(roomSeats, ({one, many}) => ({
	bookingItems: many(bookingItems),
	tickets: many(tickets),
	room: one(rooms, {
		fields: [roomSeats.roomId],
		references: [rooms.id]
	}),
	showtimeSeats: many(showtimeSeats),
}));

export const seatTypesRelations = relations(seatTypes, ({many}) => ({
	bookingItems: many(bookingItems),
}));

export const showtimeSeatsRelations = relations(showtimeSeats, ({one, many}) => ({
	bookingItems: many(bookingItems),
	booking: one(bookings, {
		fields: [showtimeSeats.bookingId],
		references: [bookings.id]
	}),
	roomSeat: one(roomSeats, {
		fields: [showtimeSeats.roomSeatId],
		references: [roomSeats.id]
	}),
	showtime: one(showtimes, {
		fields: [showtimeSeats.showtimeId],
		references: [showtimes.id]
	}),
}));

export const roomsRelations = relations(rooms, ({one, many}) => ({
	cinema: one(cinemas, {
		fields: [rooms.cinemaId],
		references: [cinemas.id]
	}),
	roomType: one(roomTypes, {
		fields: [rooms.roomTypeId],
		references: [roomTypes.id]
	}),
	seatLayouts: many(seatLayouts),
	roomSeats: many(roomSeats),
	showtimes: many(showtimes),
}));

export const cinemasRelations = relations(cinemas, ({many}) => ({
	rooms: many(rooms),
}));

export const roomTypesRelations = relations(roomTypes, ({many}) => ({
	rooms: many(rooms),
}));

export const seatLayoutsRelations = relations(seatLayouts, ({one, many}) => ({
	room: one(rooms, {
		fields: [seatLayouts.roomId],
		references: [rooms.id]
	}),
	seatLayoutItems: many(seatLayoutItems),
}));

export const seatLayoutItemsRelations = relations(seatLayoutItems, ({one}) => ({
	seatLayout: one(seatLayouts, {
		fields: [seatLayoutItems.seatLayoutId],
		references: [seatLayouts.id]
	}),
}));

export const ticketsRelations = relations(tickets, ({one}) => ({
	booking: one(bookings, {
		fields: [tickets.bookingId],
		references: [bookings.id]
	}),
	bookingItem: one(bookingItems, {
		fields: [tickets.bookingItemId],
		references: [bookingItems.id]
	}),
	roomSeat: one(roomSeats, {
		fields: [tickets.roomSeatId],
		references: [roomSeats.id]
	}),
	showtime: one(showtimes, {
		fields: [tickets.showtimeId],
		references: [showtimes.id]
	}),
}));

export const showtimesRelations = relations(showtimes, ({one, many}) => ({
	tickets: many(tickets),
	bookings: many(bookings),
	movieFormat: one(movieFormats, {
		fields: [showtimes.formatId],
		references: [movieFormats.id]
	}),
	movie: one(movies, {
		fields: [showtimes.movieId],
		references: [movies.id]
	}),
	room: one(rooms, {
		fields: [showtimes.roomId],
		references: [rooms.id]
	}),
	showtimeSeats: many(showtimeSeats),
}));

export const transactionsRelations = relations(transactions, ({one, many}) => ({
	booking: one(bookings, {
		fields: [transactions.bookingId],
		references: [bookings.id]
	}),
	user: one(users, {
		fields: [transactions.userId],
		references: [users.id]
	}),
	transactionLogs: many(transactionLogs),
}));

export const usersRelations = relations(users, ({many}) => ({
	transactions: many(transactions),
	bookings: many(bookings),
	userRoles: many(userRoles),
}));

export const transactionLogsRelations = relations(transactionLogs, ({one}) => ({
	transaction: one(transactions, {
		fields: [transactionLogs.transactionId],
		references: [transactions.id]
	}),
}));

export const bookingLogsRelations = relations(bookingLogs, ({one}) => ({
	booking: one(bookings, {
		fields: [bookingLogs.bookingId],
		references: [bookings.id]
	}),
}));

export const movieGenreMappingRelations = relations(movieGenreMapping, ({one}) => ({
	genre: one(genres, {
		fields: [movieGenreMapping.genreId],
		references: [genres.id]
	}),
	movie: one(movies, {
		fields: [movieGenreMapping.movieId],
		references: [movies.id]
	}),
}));

export const genresRelations = relations(genres, ({many}) => ({
	movieGenreMappings: many(movieGenreMapping),
}));

export const moviesRelations = relations(movies, ({many}) => ({
	movieGenreMappings: many(movieGenreMapping),
	showtimes: many(showtimes),
}));

export const movieFormatsRelations = relations(movieFormats, ({many}) => ({
	showtimes: many(showtimes),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({one}) => ({
	permission: one(permissions, {
		fields: [rolePermissions.permissionId],
		references: [permissions.id]
	}),
	role: one(roles, {
		fields: [rolePermissions.roleId],
		references: [roles.id]
	}),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	rolePermissions: many(rolePermissions),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	rolePermissions: many(rolePermissions),
	userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({one}) => ({
	role: one(roles, {
		fields: [userRoles.roleId],
		references: [roles.id]
	}),
	user: one(users, {
		fields: [userRoles.userId],
		references: [users.id]
	}),
}));

export const telescopeEntriesTagsRelations = relations(telescopeEntriesTags, ({one}) => ({
	telescopeEntry: one(telescopeEntries, {
		fields: [telescopeEntriesTags.entryUuid],
		references: [telescopeEntries.uuid]
	}),
}));

export const telescopeEntriesRelations = relations(telescopeEntries, ({many}) => ({
	telescopeEntriesTags: many(telescopeEntriesTags),
}));
