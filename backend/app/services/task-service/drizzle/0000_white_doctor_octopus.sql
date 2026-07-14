CREATE TABLE IF NOT EXISTS "task_history" (
	"id" uuid PRIMARY KEY NOT NULL,
	"task_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"action" varchar(50) NOT NULL,
	"field_name" varchar(100),
	"old_value" text,
	"new_value" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"category_id" uuid,
	"status" varchar(20) NOT NULL,
	"priority" varchar(20) NOT NULL,
	"visibility" varchar(20) NOT NULL,
	"due_date" timestamp with time zone,
	"archived" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_history_task_id_idx" ON "task_history" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "task_history_created_at_idx" ON "task_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_owner_id_idx" ON "tasks" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_category_id_idx" ON "tasks" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_status_idx" ON "tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasks_created_at_idx" ON "tasks" USING btree ("created_at");