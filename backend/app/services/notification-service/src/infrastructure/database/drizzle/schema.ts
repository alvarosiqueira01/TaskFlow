import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const notificationDeliveriesTable = pgTable('notification_deliveries', {
  id: uuid('id').primaryKey(),
  eventType: varchar('event_type', { length: 32 }).notNull(),
  channel: varchar('channel', { length: 16 }).notNull(),
  recipientUserId: uuid('recipient_user_id').notNull(),
  taskId: uuid('task_id'),
  commentId: uuid('comment_id'),
  subject: varchar('subject', { length: 255 }).notNull(),
  body: text('body').notNull(),
  status: varchar('status', { length: 16 }).notNull(),
  failureReason: text('failure_reason'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  sentAt: timestamp('sent_at', { withTimezone: true }),
});
