import { pgEnum } from "drizzle-orm/pg-core";

export const bookingStatusEnum = pgEnum("booking_status_enum", ['pending', 'confirmed', 'cancelled', 'expired']);
export const cinemaStatus = pgEnum("cinema_status", ['active', 'inactive', 'maintenance']);
export const genderTypeEnum = pgEnum("gender_type_enum", ['male', 'female', 'other', 'not_specified']);
export const movieStatusEnum = pgEnum("movie_status_enum", ['coming_soon', 'now_showing', 'ended']);
export const roomScreenType = pgEnum("room_screen_type", ['standard', 'imax', '4k', 'other']);
export const roomSoundType = pgEnum("room_sound_type", ['standard', 'dts', 'other']);
export const seatTypeEnum = pgEnum("seat_type_enum", ['standard', 'vip', 'premium', 'couple', 'sweetbox', 'wheelchair']);
export const showtimeSeatStatusEnum = pgEnum("showtime_seat_status_enum", ['available', 'hold', 'sold', 'blocked']);
export const showtimeStatusEnum = pgEnum("showtime_status_enum", ['active', 'cancelled', 'ended', 'sold_out']);
export const ticketStatusEnum = pgEnum("ticket_status_enum", ['valid', 'used', 'cancelled']);
export const transactionStatusEnum = pgEnum("transaction_status_enum", ['pending', 'processing', 'success', 'failed', 'cancelled']);
