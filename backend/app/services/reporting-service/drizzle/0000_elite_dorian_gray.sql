CREATE TABLE IF NOT EXISTS "category_projections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_projections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"owner_id" uuid NOT NULL,
	"category_id" uuid,
	"title" varchar(200) NOT NULL,
	"status" varchar(32) NOT NULL,
	"priority" varchar(16) DEFAULT 'MEDIUM' NOT NULL,
	"due_date" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"media_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_projections_owner_idx" ON "task_projections" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_projections_status_idx" ON "task_projections" USING btree ("status");