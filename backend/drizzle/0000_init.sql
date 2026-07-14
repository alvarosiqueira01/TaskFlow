CREATE TABLE "roles" (
  "id" uuid PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "description" varchar(255),
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "username" varchar(50) UNIQUE NOT NULL,
  "email" varchar(255) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "full_name" varchar(150),
  "avatar_url" varchar(500),
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "user_roles" (
  "user_id" uuid NOT NULL,
  "role_id" uuid NOT NULL,
  "assigned_at" timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY ("user_id", "role_id")
);

CREATE TABLE "categories" (
  "id" uuid PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "description" varchar(255),
  "color" varchar(20),
  "created_by" uuid NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "tasks" (
  "id" uuid PRIMARY KEY,
  "owner_id" uuid NOT NULL,
  "category_id" uuid,
  "title" varchar(200) NOT NULL,
  "description" text,
  "status" varchar(20) NOT NULL DEFAULT 'BACKLOG',
  "priority" varchar(20) NOT NULL DEFAULT 'MEDIUM',
  "visibility" varchar(20) NOT NULL DEFAULT 'PRIVATE',
  "due_date" timestamp,
  "archived" boolean NOT NULL DEFAULT false,
  "completed_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "assignments" (
  "task_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "assigned_by" uuid NOT NULL,
  "assigned_at" timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY ("task_id", "user_id")
);

CREATE TABLE "comments" (
  "id" uuid PRIMARY KEY,
  "task_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "parent_comment_id" uuid,
  "content" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE "comment_mentions" (
  "comment_id" uuid NOT NULL,
  "mentioned_user_id" uuid NOT NULL,
  PRIMARY KEY ("comment_id", "mentioned_user_id")
);

CREATE TABLE "media_attachments" (
  "id" uuid PRIMARY KEY,
  "task_id" uuid NOT NULL,
  "uploaded_by" uuid NOT NULL,
  "media_type" varchar(20) NOT NULL,
  "original_filename" varchar(255) NOT NULL,
  "storage_key" varchar(500) UNIQUE NOT NULL,
  "mime_type" varchar(100) NOT NULL,
  "file_size" bigint NOT NULL,
  "duration_seconds" int,
  "width" int,
  "height" int,
  "thumbnail_key" varchar(500),
  "checksum" varchar(128),
  "uploaded_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE "notifications" (
  "id" uuid PRIMARY KEY,
  "user_id" uuid NOT NULL,
  "task_id" uuid,
  "comment_id" uuid,
  "type" varchar(30) NOT NULL,
  "title" varchar(150) NOT NULL,
  "message" text NOT NULL,
  "is_read" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "read_at" timestamp
);

CREATE TABLE "task_history" (
  "id" uuid PRIMARY KEY,
  "task_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "action" varchar(50) NOT NULL,
  "field_name" varchar(100),
  "old_value" text,
  "new_value" text,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE UNIQUE INDEX ON "users" ("email");

CREATE UNIQUE INDEX ON "users" ("username");

CREATE INDEX ON "users" ("is_active");

CREATE INDEX ON "user_roles" ("role_id");

CREATE INDEX ON "categories" ("created_by");

CREATE UNIQUE INDEX ON "categories" ("created_by", "name");

CREATE INDEX ON "tasks" ("owner_id");

CREATE INDEX ON "tasks" ("category_id");

CREATE INDEX ON "tasks" ("status");

CREATE INDEX ON "tasks" ("priority");

CREATE INDEX ON "tasks" ("due_date");

CREATE INDEX ON "tasks" ("archived");

CREATE INDEX ON "tasks" ("completed_at");

CREATE INDEX ON "tasks" ("owner_id", "status");

CREATE INDEX ON "tasks" ("owner_id", "due_date");

CREATE INDEX ON "tasks" ("owner_id", "priority");

CREATE INDEX ON "tasks" ("category_id", "status");

CREATE INDEX ON "tasks" ("owner_id", "archived");

CREATE INDEX ON "assignments" ("user_id");

CREATE INDEX ON "assignments" ("assigned_by");

CREATE INDEX ON "comments" ("task_id");

CREATE INDEX ON "comments" ("user_id");

CREATE INDEX ON "comments" ("parent_comment_id");

CREATE INDEX ON "comments" ("task_id", "created_at");

CREATE INDEX ON "comment_mentions" ("mentioned_user_id");

CREATE UNIQUE INDEX ON "media_attachments" ("storage_key");

CREATE INDEX ON "media_attachments" ("task_id");

CREATE INDEX ON "media_attachments" ("uploaded_by");

CREATE INDEX ON "media_attachments" ("media_type");

CREATE INDEX ON "media_attachments" ("task_id", "media_type");

CREATE INDEX ON "notifications" ("user_id");

CREATE INDEX ON "notifications" ("is_read");

CREATE INDEX ON "notifications" ("type");

CREATE INDEX ON "notifications" ("user_id", "is_read");

CREATE INDEX ON "notifications" ("user_id", "created_at");

CREATE INDEX ON "task_history" ("task_id");

CREATE INDEX ON "task_history" ("user_id");

CREATE INDEX ON "task_history" ("task_id", "created_at");

COMMENT ON COLUMN "tasks"."status" IS 'BACKLOG, TODO, IN_PROGRESS, REVIEW, COMPLETED';

COMMENT ON COLUMN "tasks"."priority" IS 'LOW, MEDIUM, HIGH, CRITICAL';

COMMENT ON COLUMN "tasks"."visibility" IS 'PRIVATE, SHARED';

COMMENT ON COLUMN "media_attachments"."media_type" IS 'VIDEO, AUDIO';

COMMENT ON COLUMN "notifications"."type" IS 'ASSIGNMENT, TASK_UPDATED, MENTION';

ALTER TABLE "user_roles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "user_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "categories" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "tasks" ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "tasks" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "assignments" ADD FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "assignments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "assignments" ADD FOREIGN KEY ("assigned_by") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "comments" ADD FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "comments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "comments" ADD FOREIGN KEY ("parent_comment_id") REFERENCES "comments" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "comment_mentions" ADD FOREIGN KEY ("comment_id") REFERENCES "comments" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "comment_mentions" ADD FOREIGN KEY ("mentioned_user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "media_attachments" ADD FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "media_attachments" ADD FOREIGN KEY ("uploaded_by") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notifications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notifications" ADD FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notifications" ADD FOREIGN KEY ("comment_id") REFERENCES "comments" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "task_history" ADD FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "task_history" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
