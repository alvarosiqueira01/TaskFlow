import { pgTable, uuid, varchar, integer, bigint, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const mediaAttachmentsTable = pgTable(
  'media_attachments',
  {
    id: uuid('id').primaryKey(),
    taskId: uuid('task_id').notNull(),
    uploadedBy: uuid('uploaded_by').notNull(),
    mediaType: varchar('media_type', { length: 10 }).notNull(),
    originalFilename: varchar('original_filename', { length: 255 }).notNull(),
    storageKey: varchar('storage_key', { length: 500 }).notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    fileSize: bigint('file_size', { mode: 'number' }).notNull(),
    durationSeconds: integer('duration_seconds'),
    width: integer('width'),
    height: integer('height'),
    thumbnailKey: varchar('thumbnail_key', { length: 500 }),
    checksum: varchar('checksum', { length: 128 }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    taskIdIdx: index('media_attachments_task_id_idx').on(table.taskId),
    uploadedByIdx: index('media_attachments_uploaded_by_idx').on(table.uploadedBy),
    storageKeyIdx: index('media_attachments_storage_key_idx').on(table.storageKey),
  }),
);

export const mediaUploadSessionsTable = pgTable(
  'media_upload_sessions',
  {
    id: uuid('id').primaryKey(),
    taskId: uuid('task_id').notNull(),
    uploadedBy: uuid('uploaded_by').notNull(),
    originalFilename: varchar('original_filename', { length: 255 }).notNull(),
    contentType: varchar('content_type', { length: 100 }).notNull(),
    fileSize: bigint('file_size', { mode: 'number' }).notNull(),
    storageKey: varchar('storage_key', { length: 500 }).notNull(),
    multipart: boolean('multipart').notNull().default(false),
    s3MultipartUploadId: varchar('s3_multipart_upload_id', { length: 500 }),
    status: varchar('status', { length: 20 }).notNull().default('INITIATED'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (table) => ({
    taskIdIdx: index('media_upload_sessions_task_id_idx').on(table.taskId),
  }),
);
