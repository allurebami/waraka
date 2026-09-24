CREATE TABLE IF NOT EXISTS "audit" (
	"id" text PRIMARY KEY NOT NULL,
	"actor" text NOT NULL,
	"action" text NOT NULL,
	"target" text NOT NULL,
	"note" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"name" text NOT NULL,
	"size" integer NOT NULL,
	"mime" text NOT NULL,
	"object_key" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_owner_idx" ON "documents" ("owner");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"kind" text NOT NULL,
	"name" text,
	"email" text,
	"target" text,
	"message" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"owner" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"category" text NOT NULL,
	"city" text NOT NULL,
	"region" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"languages" text DEFAULT '' NOT NULL,
	"hours" text DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"description" text NOT NULL,
	"consent" integer NOT NULL,
	"status" text DEFAULT 'Brouillon' NOT NULL,
	"review_note" text,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "records" (
	"id" text PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"kind" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"city" text DEFAULT '' NOT NULL,
	"region" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"description" text NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"status" text NOT NULL,
	"published" integer DEFAULT 0 NOT NULL,
	"code" text,
	"verified_at" text,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "records_code_unique" ON "records" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "records_owner_idx" ON "records" ("owner");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "records_public_idx" ON "records" ("published","kind");