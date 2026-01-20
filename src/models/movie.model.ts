import { pgTable, bigserial, varchar, text, timestamp, date, integer, boolean, index, unique, bigint, foreignKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { movieStatusEnum } from "./enums";

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
