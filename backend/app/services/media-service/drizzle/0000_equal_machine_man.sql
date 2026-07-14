CREATE TABLE IF NOT EXISTS "media_attachments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"task_id" uuid NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"media_type" varchar(10) NOT NULL,
	"original_filename" varchar(255) NOT NULL,
	"storage_key" varchar(500) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"file_size" bigint NOT NULL,
	"duration_seconds" integer,
	"width" integer,
	"height" integer,
	"thumbnail_key" varchar(500),
	"checksum" varchar(128),
	"deleted_at" timestamp with time zone,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media_upload_sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"task_id" uuid NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"original_filename" varchar(255) NOT NULL,
	"content_type" varchar(100) NOT NULL,
	"file_size" bigint NOT NULL,
	"storage_key" varchar(500) NOT NULL,
	"multipart" boolean DEFAULT false NOT NULL,
	"s3_multipart_upload_id" varchar(500),
	"status" varchar(20) DEFAULT 'INITIATED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_attachments_task_id_idx" ON "media_attachments" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_attachments_uploaded_by_idx" ON "media_attachments" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_attachments_storage_key_idx" ON "media_attachments" USING btree ("storage_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_upload_sessions_task_id_idx" ON "media_upload_sessions" USING btree ("task_id");