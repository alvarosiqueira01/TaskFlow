import { pgTable, uuid, varchar, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const tasksTable = pgTable(
  'tasks',
  {
    id: uuid('id').primaryKey(),
    ownerId: uuid('owner_id').notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description'),
    categoryId: uuid('category_id'),
    status: varchar('status', { length: 20 }).notNull(),
    priority: varchar('priority', { length: 20 }).notNull(),
    visibility: varchar('visibility', { length: 20 }).notNull(),
    dueDate: timestamp('due_date', { withTimezone: true }),
    archived: boolean('archived').notNull().default(false),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    ownerIdIdx: index('tasks_owner_id_idx').on(table.ownerId),
    categoryIdIdx: index('tasks_category_id_idx').on(table.categoryId),
    statusIdx: index('tasks_status_idx').on(table.status),
    createdAtIdx: index('tasks_created_at_idx').on(table.createdAt),
  }),
);

export const taskHistoryTable = pgTable(
  'task_history',
  {
    id: uuid('id').primaryKey(),
    taskId: uuid('task_id').notNull(),
    userId: uuid('user_id').notNull(),
    action: varchar('action', { length: 50 }).notNull(),
    fieldName: varchar('field_name', { length: 100 }),
    oldValue: text('old_value'),
    newValue: text('new_value'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    taskIdIdx: index('task_history_task_id_idx').on(table.taskId),
    createdAtIdx: index('task_history_created_at_idx').on(table.createdAt),
  }),
);
