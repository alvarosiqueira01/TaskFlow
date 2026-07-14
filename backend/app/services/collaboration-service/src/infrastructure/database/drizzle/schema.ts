import { sql } from 'drizzle-orm';
import { boolean, index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const assignmentsTable = pgTable(
  'assignments',
  {
    id: uuid('id').primaryKey(),
    taskId: uuid('task_id').notNull(),
    userId: uuid('user_id').notNull(),
    assignedBy: uuid('assigned_by').notNull(),
    assignedAt: timestamp('assigned_at', { withTimezone: true }).notNull(),
  },
  (table) => ({
    taskUserIdx: index('assignments_task_user_idx').on(table.taskId, table.userId),
  }),
);

export const commentsTable = pgTable(
  'comments',
  {
    id: uuid('id').primaryKey(),
    taskId: uuid('task_id').notNull(),
    userId: uuid('user_id').notNull(),
    content: text('content').notNull(),
    parentCommentId: uuid('parent_comment_id'),
    // Apply the raw SQL template string here
    mentions: text('mentions').array().notNull().default(sql`'{}'::text[]`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    deletedAt: timestamp('updated_at', { withTimezone: true })
  },
  (table) => ({
    taskIdx: index('comments_task_idx').on(table.taskId, table.createdAt),
  }),
);

export const notificationsTable = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id').notNull(),
    taskId: uuid('task_id'),
    commentId: uuid('comment_id'),
    type: varchar('type', { length: 32 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    isRead: boolean('is_read').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
    readAt: timestamp('read_at', { withTimezone: true }),
  },
  (table) => ({
    userIdx: index('notifications_user_idx').on(table.userId, table.createdAt),
  }),
);

export const taskReferencesTable = pgTable('task_references', {
  id: uuid('id').primaryKey(),
  ownerId: uuid('owner_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  status: varchar('status', { length: 32 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});