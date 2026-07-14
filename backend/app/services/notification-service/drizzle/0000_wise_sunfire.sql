CREATE TABLE IF NOT EXISTS "notification_deliveries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"event_type" varchar(32) NOT NULL,
	"channel" varchar(16) NOT NULL,
	"recipient_user_id" uuid NOT NULL,
	"task_id" uuid,
	"comment_id" uuid,
	"subject" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"status" varchar(16) NOT NULL,
	"failure_reason" text,
	"created_at" timestamp with time zone NOT NULL,
	"sent_at" timestamp with time zone
);
