import { boolean, index, integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const taskProjectionsTable = pgTable(
  'task_projections',
  {
    id: uuid('id').primaryKey(),
    ownerId: uuid('owner_id').notNull(),
    categoryId: uuid('category_id'),
    title: varchar('title', { length: 200 }).notNull(),
    status: varchar('status', { length: 32 }).notNull(),
    priority: varchar('priority', { length: 16 }).notNull().default('MEDIUM'),
    dueDate: timestamp('due_date', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    commentsCount: integer('comments_count').notNull().default(0),
    mediaCount: integer('media_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  },
  (table) => ({
    ownerIdx: index('task_projections_owner_idx').on(table.ownerId),
    statusIdx: index('task_projections_status_idx').on(table.status),
  }),
);

export const categoryProjectionsTable = pgTable('category_projections', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});

// Column re-exported for readability where a boolean flag might be
// needed by future migrations (e.g. archived tasks exclusion).
export const _unusedBooleanTypeReference: typeof boolean = boolean;
