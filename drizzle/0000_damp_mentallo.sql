-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."booking_status_enum" AS ENUM('pending', 'confirmed', 'cancelled', 'expired');--> statement-breakpoint
CREATE TYPE "public"."cinema_status" AS ENUM('active', 'inactive', 'maintenance');--> statement-breakpoint
CREATE TYPE "public"."gender_type_enum" AS ENUM('male', 'female', 'other', 'not_specified');--> statement-breakpoint
CREATE TYPE "public"."movie_status_enum" AS ENUM('coming_soon', 'now_showing', 'ended');--> statement-breakpoint
CREATE TYPE "public"."room_screen_type" AS ENUM('standard', 'imax', '4k', 'other');--> statement-breakpoint
CREATE TYPE "public"."room_sound_type" AS ENUM('standard', 'dts', 'other');--> statement-breakpoint
CREATE TYPE "public"."seat_type_enum" AS ENUM('standard', 'vip', 'premium', 'couple', 'sweetbox', 'wheelchair');--> statement-breakpoint
CREATE TYPE "public"."showtime_seat_status_enum" AS ENUM('available', 'hold', 'sold', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."showtime_status_enum" AS ENUM('active', 'cancelled', 'ended', 'sold_out');--> statement-breakpoint
CREATE TYPE "public"."ticket_status_enum" AS ENUM('valid', 'used', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."transaction_status_enum" AS ENUM('pending', 'processing', 'success', 'failed', 'cancelled');--> statement-breakpoint
CREATE TABLE "booking_items" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"booking_id" bigint NOT NULL,
	"showtime_seat_id" bigint NOT NULL,
	"seat_type_id" bigint NOT NULL,
	"room_seat_id" bigint NOT NULL,
	"seat_code" varchar(10) NOT NULL,
	"seat_type" "seat_type_enum" NOT NULL,
	"original_price" numeric(10, 2) NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT '0',
	"final_price" numeric(10, 2) NOT NULL,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "uk_booking_showtime_seat" UNIQUE("booking_id","showtime_seat_id")
);
--> statement-breakpoint
CREATE TABLE "seat_types" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"type_code" varchar(20) NOT NULL,
	"type_name" varchar(50) NOT NULL,
	"description" text,
	"status" boolean DEFAULT true,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "seat_types_type_code_key" UNIQUE("type_code")
);
--> statement-breakpoint
CREATE TABLE "cinemas" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"code" varchar(100) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"address" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"district" varchar(100),
	"phone" varchar(20),
	"email" varchar(100),
	"opening_hours" jsonb DEFAULT '[]'::jsonb,
	"status" "cinema_status" DEFAULT 'active',
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "cinemas_code_key" UNIQUE("code"),
	CONSTRAINT "cinemas_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"cinema_id" bigint NOT NULL,
	"room_type_id" bigint NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(50) NOT NULL,
	"total_seats" integer DEFAULT 0 NOT NULL,
	"total_rows" integer NOT NULL,
	"max_seats_per_row" integer NOT NULL,
	"screen_size" "room_screen_type" DEFAULT 'standard',
	"sound_system" "room_sound_type" DEFAULT 'standard',
	"status" integer DEFAULT 1,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "room_types" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"type_name" varchar(50) NOT NULL,
	"description" text,
	"status" boolean DEFAULT true,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "room_types_type_name_key" UNIQUE("type_name")
);
--> statement-breakpoint
CREATE TABLE "seat_layouts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"room_id" bigint NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"total_rows" integer NOT NULL,
	"max_seats_per_row" integer NOT NULL,
	"layout_config" jsonb DEFAULT '[]'::jsonb,
	"is_default" boolean DEFAULT false,
	"status" boolean DEFAULT true,
	"created_by" varchar(100),
	"updated_by" varchar(100),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "seat_layout_items" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"seat_layout_id" bigint NOT NULL,
	"row_number" integer NOT NULL,
	"seat_number" integer NOT NULL,
	"seat_code" varchar(10) NOT NULL,
	"seat_type" "seat_type_enum" DEFAULT 'standard',
	"is_disabled" boolean DEFAULT false,
	"is_wheelchair_accessible" boolean DEFAULT false,
	"is_aisle" boolean DEFAULT false,
	"is_available" boolean DEFAULT true,
	"position_x" integer,
	"position_y" integer,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"name" varchar(100),
	"date_of_birth" date,
	"email_verified_at" timestamp with time zone,
	"password" varchar(255) NOT NULL,
	"gender" "gender_type_enum" DEFAULT 'not_specified',
	"avatar" varchar(500) DEFAULT NULL,
	"membership_tier" varchar(200),
	"loyalty_points" integer DEFAULT 0,
	"total_spent" numeric(12, 2) DEFAULT '0',
	"enable" integer DEFAULT 1,
	"log_on_date" timestamp with time zone,
	"lock_count" integer DEFAULT 0,
	"locked_at" timestamp with time zone,
	"created_by" varchar(100),
	"deleted_by" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"code" varchar(50) DEFAULT '' NOT NULL,
	CONSTRAINT "users_email_key" UNIQUE("email"),
	CONSTRAINT "users_phone_key" UNIQUE("phone"),
	CONSTRAINT "users_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" varchar(30) NOT NULL,
	"booking_id" bigint NOT NULL,
	"booking_item_id" bigint NOT NULL,
	"showtime_id" bigint NOT NULL,
	"room_seat_id" bigint NOT NULL,
	"seat_code" varchar(10) NOT NULL,
	"qr_code" text,
	"barcode" varchar(100),
	"ticket_status" "ticket_status_enum" DEFAULT 'valid',
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	CONSTRAINT "tickets_code_key" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"booking_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"transaction_code" varchar(50) NOT NULL,
	"payment_method_id" bigint NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"transaction_fee" numeric(10, 2) DEFAULT '0',
	"final_amount" numeric(10, 2) NOT NULL,
	"transaction_status" "transaction_status_enum" DEFAULT 'pending',
	"transaction_date" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"completed_date" timestamp with time zone,
	"gateway_transaction_id" varchar(100),
	"gateway_response" text,
	"notes" text,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "transactions_transaction_code_key" UNIQUE("transaction_code")
);
--> statement-breakpoint
CREATE TABLE "transaction_logs" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"transaction_id" bigint NOT NULL,
	"old_status" varchar(50),
	"new_status" varchar(50),
	"changed_by" varchar(100),
	"change_reason" text,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"method_code" varchar(50) NOT NULL,
	"method_name" varchar(100) NOT NULL,
	"method_type" varchar(50),
	"is_active" boolean DEFAULT true,
	CONSTRAINT "payment_methods_method_code_key" UNIQUE("method_code")
);
--> statement-breakpoint
CREATE TABLE "room_seats" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"room_id" bigint NOT NULL,
	"row_number" integer NOT NULL,
	"seat_number" integer NOT NULL,
	"seat_code" varchar(10) NOT NULL,
	"seat_type" "seat_type_enum" DEFAULT 'standard',
	"base_price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"is_aisle" boolean DEFAULT false,
	"is_available" boolean DEFAULT true,
	"position_x" integer,
	"position_y" integer,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "uk_room_seat_position" UNIQUE("room_id","row_number","seat_number"),
	CONSTRAINT "room_seats_seat_code_key" UNIQUE("seat_code")
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"name_en" varchar(50),
	"description" text,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "genres_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" varchar(200) NOT NULL,
	"title" varchar(300) NOT NULL,
	"title_en" varchar(300),
	"description" text,
	"director" varchar(200),
	"cast" text,
	"duration_minutes" integer NOT NULL,
	"release_date" date NOT NULL,
	"end_date" date,
	"rating" varchar DEFAULT 'T18',
	"language" varchar(50) DEFAULT 'vietnamese',
	"subtitle_language" varchar(50),
	"poster_url" varchar(500) DEFAULT NULL,
	"trailer_url" varchar(500) DEFAULT NULL,
	"banner_url" varchar(500) DEFAULT NULL,
	"status" "movie_status_enum" DEFAULT 'coming_soon',
	"is_3d" boolean DEFAULT false,
	"is_imax" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"views_count" integer DEFAULT 0,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "movies_code_key" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "booking_logs" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"booking_id" bigint NOT NULL,
	"log_type" varchar(50),
	"old_value" text,
	"new_value" text,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "movie_ratings" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" varchar(10) NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"min_age" integer,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "movie_ratings_code_key" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "movie_genre_mapping" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"movie_id" bigint NOT NULL,
	"genre_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "uk_movie_genre" UNIQUE("movie_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" varchar(200) NOT NULL,
	"user_id" bigint NOT NULL,
	"showtime_id" bigint NOT NULL,
	"total_seats" integer NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT '0',
	"tax_amount" numeric(10, 2) DEFAULT '0',
	"total_amount" numeric(10, 2) NOT NULL,
	"final_price" numeric(10, 2) NOT NULL,
	"voucher_code" varchar(100) DEFAULT NULL,
	"status" "booking_status_enum" DEFAULT 'pending',
	"expires_at" timestamp with time zone NOT NULL,
	"customer_name" varchar(200),
	"customer_phone" varchar(20) DEFAULT NULL,
	"customer_email" varchar(255),
	"is_paid" boolean DEFAULT false,
	"payment_method_id" varchar(20) DEFAULT NULL,
	"notes" text,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "bookings_code_key" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "showtimes" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"movie_id" bigint NOT NULL,
	"room_id" bigint NOT NULL,
	"format_id" bigint NOT NULL,
	"showtime_date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"language" varchar(200) DEFAULT 'vietnamese',
	"base_price" numeric(10, 2) NOT NULL,
	"is_premiere" boolean DEFAULT false,
	"is_holiday" boolean DEFAULT false,
	"available_seats" integer,
	"booked_seats" integer DEFAULT 0,
	"held_seats" integer DEFAULT 0,
	"sold_seats" integer DEFAULT 0,
	"status" "showtime_status_enum" DEFAULT 'active',
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "uk_room_time_slot" UNIQUE("room_id","showtime_date","start_time")
);
--> statement-breakpoint
CREATE TABLE "movie_formats" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"code" varchar(20) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"status" boolean DEFAULT true,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "movie_formats_code_key" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "showtime_seats" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"showtime_id" bigint NOT NULL,
	"room_seat_id" bigint NOT NULL,
	"booking_id" bigint,
	"status" "showtime_seat_status_enum" DEFAULT 'available',
	"price" numeric(10, 2) NOT NULL,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "uk_showtime_seat" UNIQUE("showtime_id","room_seat_id")
);
--> statement-breakpoint
CREATE TABLE "cim_sql_error" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"table_name" varchar(200),
	"operation" varchar(50),
	"error_message" text,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "cim_sql_log_db" (
	"sys_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"sys_ts" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"sys_op" varchar(20) NOT NULL,
	"table_name" varchar(200) NOT NULL,
	"operation" varchar(50) NOT NULL,
	"old_data" jsonb,
	"new_data" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" integer NOT NULL,
	"action" varchar(50) NOT NULL,
	"old_data" jsonb,
	"new_data" jsonb,
	"user_id" integer,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "seat_hold_config" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"hold_duration_minutes" integer DEFAULT 15,
	"max_hold_per_user" integer DEFAULT 10,
	"auto_release_enabled" boolean DEFAULT true,
	"release_batch_size" integer DEFAULT 100,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"resource" varchar(50) NOT NULL,
	"action" varchar(50) NOT NULL,
	"description" text,
	"is_system" boolean DEFAULT true NOT NULL,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_slug_key" UNIQUE("slug"),
	CONSTRAINT "permissions_resource_key" UNIQUE("resource")
);
--> statement-breakpoint
CREATE TABLE "cim_sql_log" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"sql_text" text NOT NULL,
	"sql_params" jsonb,
	"operation" varchar(50),
	"duration_ms" varchar,
	"executed_by" varchar(100),
	"user_id" varchar(100) DEFAULT NULL,
	"module" varchar(100),
	"ip_address" varchar(45),
	"user_agent" text,
	"is_error" boolean DEFAULT false,
	"message" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"is_system" boolean DEFAULT false NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"created_by" varchar(100) DEFAULT NULL,
	"updated_by" varchar(100) DEFAULT NULL,
	"deleted_by" varchar(100) DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "roles_name_key" UNIQUE("name"),
	CONSTRAINT "roles_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" bigserial NOT NULL,
	"permission_id" bigserial NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigserial NOT NULL,
	"role_id" bigserial NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"migration" varchar(255) NOT NULL,
	"batch" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cache_locks" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"owner" varchar(255) NOT NULL,
	"expiration" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cache" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"expiration" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"queue" varchar(255) NOT NULL,
	"payload" text NOT NULL,
	"attempts" smallint NOT NULL,
	"reserved_at" integer,
	"available_at" integer NOT NULL,
	"created_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_batches" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"total_jobs" integer NOT NULL,
	"pending_jobs" integer NOT NULL,
	"failed_jobs" integer NOT NULL,
	"failed_job_ids" text NOT NULL,
	"options" text,
	"cancelled_at" integer,
	"created_at" integer NOT NULL,
	"finished_at" integer
);
--> statement-breakpoint
CREATE TABLE "failed_jobs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"uuid" varchar(255) NOT NULL,
	"connection" text NOT NULL,
	"queue" text NOT NULL,
	"payload" text NOT NULL,
	"exception" text NOT NULL,
	"failed_at" timestamp(0) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "failed_jobs_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "telescope_entries" (
	"sequence" bigserial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"batch_id" uuid NOT NULL,
	"family_hash" varchar(255),
	"should_display_on_index" boolean DEFAULT true NOT NULL,
	"type" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp(0),
	CONSTRAINT "telescope_entries_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "telescope_monitoring" (
	"tag" varchar(255) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" bigint,
	"ip_address" varchar(45),
	"user_agent" text,
	"payload" text NOT NULL,
	"last_activity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telescope_entries_tags" (
	"entry_uuid" uuid NOT NULL,
	"tag" varchar(255) NOT NULL,
	CONSTRAINT "telescope_entries_tags_pkey" PRIMARY KEY("entry_uuid","tag")
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"email" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"ip_address" "inet",
	"status" integer DEFAULT 1,
	CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY("email","token")
);
--> statement-breakpoint
ALTER TABLE "booking_items" ADD CONSTRAINT "fk_booking_item_booking" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_items" ADD CONSTRAINT "fk_booking_item_room_seat" FOREIGN KEY ("room_seat_id") REFERENCES "public"."room_seats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_items" ADD CONSTRAINT "fk_booking_item_seat_type" FOREIGN KEY ("seat_type_id") REFERENCES "public"."seat_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_items" ADD CONSTRAINT "fk_booking_item_showtime_seat" FOREIGN KEY ("showtime_seat_id") REFERENCES "public"."showtime_seats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "fk_rooms_cinema" FOREIGN KEY ("cinema_id") REFERENCES "public"."cinemas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "fk_rooms_type" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat_layouts" ADD CONSTRAINT "seat_layouts_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat_layout_items" ADD CONSTRAINT "seat_layout_items_seat_layout_id_fkey" FOREIGN KEY ("seat_layout_id") REFERENCES "public"."seat_layouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "fk_ticket_booking" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "fk_ticket_booking_item" FOREIGN KEY ("booking_item_id") REFERENCES "public"."booking_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "fk_ticket_room_seat" FOREIGN KEY ("room_seat_id") REFERENCES "public"."room_seats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "fk_ticket_showtime" FOREIGN KEY ("showtime_id") REFERENCES "public"."showtimes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "fk_transaction_booking" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "fk_transaction_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_logs" ADD CONSTRAINT "fk_log_transaction" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_seats" ADD CONSTRAINT "fk_room_seats_room" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_logs" ADD CONSTRAINT "fk_booking_log_booking" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_genre_mapping" ADD CONSTRAINT "fk_movie_genre_genre" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_genre_mapping" ADD CONSTRAINT "fk_movie_genre_movie" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "fk_booking_showtime" FOREIGN KEY ("showtime_id") REFERENCES "public"."showtimes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "fk_booking_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showtimes" ADD CONSTRAINT "fk_showtime_format" FOREIGN KEY ("format_id") REFERENCES "public"."movie_formats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showtimes" ADD CONSTRAINT "fk_showtime_movie" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showtimes" ADD CONSTRAINT "fk_showtime_room" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showtime_seats" ADD CONSTRAINT "fk_showtime_seat_booking" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showtime_seats" ADD CONSTRAINT "fk_showtime_seat_roomseat" FOREIGN KEY ("room_seat_id") REFERENCES "public"."room_seats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showtime_seats" ADD CONSTRAINT "fk_showtime_seat_showtime" FOREIGN KEY ("showtime_id") REFERENCES "public"."showtimes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "fk_permission" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "fk_role" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "fk_role" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telescope_entries_tags" ADD CONSTRAINT "telescope_entries_tags_entry_uuid_foreign" FOREIGN KEY ("entry_uuid") REFERENCES "public"."telescope_entries"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_ticket_booking_id" ON "tickets" USING btree ("booking_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_ticket_qr_hash" ON "tickets" USING btree (md5(qr_code) text_ops);--> statement-breakpoint
CREATE INDEX "idx_ticket_showtime_id" ON "tickets" USING btree ("showtime_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_ticket_status" ON "tickets" USING btree ("ticket_status" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_transactions_booking_id" ON "transactions" USING btree ("booking_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_transactions_date" ON "transactions" USING btree ("transaction_date" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_transactions_gateway_id" ON "transactions" USING btree ("gateway_transaction_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_transactions_status" ON "transactions" USING btree ("transaction_status" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_transactions_user_id" ON "transactions" USING btree ("user_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_transaction_logs_created_at" ON "transaction_logs" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_transaction_logs_transaction_id" ON "transaction_logs" USING btree ("transaction_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_room_available" ON "room_seats" USING btree ("room_id" int8_ops,"is_available" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_seat_type" ON "room_seats" USING btree ("seat_type" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_genre_name" ON "genres" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_movies_status_release" ON "movies" USING btree ("status" enum_ops,"release_date" date_ops);--> statement-breakpoint
CREATE INDEX "idx_movies_title" ON "movies" USING btree ("title" text_ops);--> statement-breakpoint
CREATE INDEX "idx_booking_logs_booking_id" ON "booking_logs" USING btree ("booking_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_booking_logs_created_at" ON "booking_logs" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_booking_logs_log_type" ON "booking_logs" USING btree ("log_type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_bookings_code" ON "bookings" USING btree ("code" text_ops);--> statement-breakpoint
CREATE INDEX "idx_bookings_expires" ON "bookings" USING btree ("expires_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_bookings_showtime" ON "bookings" USING btree ("showtime_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_bookings_status_created" ON "bookings" USING btree ("status" enum_ops,"created_at" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_bookings_user_status" ON "bookings" USING btree ("user_id" enum_ops,"status" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_showtime_seats_booking" ON "showtime_seats" USING btree ("booking_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_showtime_seats_showtime_status" ON "showtime_seats" USING btree ("showtime_id" enum_ops,"status" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_audit_action" ON "audit_logs" USING btree ("action" text_ops);--> statement-breakpoint
CREATE INDEX "idx_audit_created_at" ON "audit_logs" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_audit_entity" ON "audit_logs" USING btree ("entity_type" text_ops,"entity_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_audit_user" ON "audit_logs" USING btree ("user_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_sql_created_at" ON "cim_sql_log" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_sql_error" ON "cim_sql_log" USING btree ("is_error" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_sql_op" ON "cim_sql_log" USING btree ("operation" text_ops);--> statement-breakpoint
CREATE INDEX "idx_sql_user" ON "cim_sql_log" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_role_perms_perm" ON "role_permissions" USING btree ("permission_id" int8_ops);--> statement-breakpoint
CREATE INDEX "idx_role_perms_role" ON "role_permissions" USING btree ("role_id" int8_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_role_perms_unique" ON "role_permissions" USING btree ("role_id" int8_ops,"permission_id" int8_ops);--> statement-breakpoint
CREATE INDEX "jobs_queue_index" ON "jobs" USING btree ("queue" text_ops);--> statement-breakpoint
CREATE INDEX "telescope_entries_batch_id_index" ON "telescope_entries" USING btree ("batch_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "telescope_entries_created_at_index" ON "telescope_entries" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "telescope_entries_family_hash_index" ON "telescope_entries" USING btree ("family_hash" text_ops);--> statement-breakpoint
CREATE INDEX "telescope_entries_type_should_display_on_index_index" ON "telescope_entries" USING btree ("type" text_ops,"should_display_on_index" text_ops);--> statement-breakpoint
CREATE INDEX "sessions_last_activity_index" ON "sessions" USING btree ("last_activity" int4_ops);--> statement-breakpoint
CREATE INDEX "sessions_user_id_index" ON "sessions" USING btree ("user_id" int8_ops);--> statement-breakpoint
CREATE INDEX "telescope_entries_tags_tag_index" ON "telescope_entries_tags" USING btree ("tag" text_ops);
*/