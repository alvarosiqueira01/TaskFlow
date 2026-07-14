import { MediaAttachment } from '../../../domain/entities/media-attachment.entity';
import { mediaAttachmentsTable } from '../../database/drizzle/schema';

type MediaRow = typeof mediaAttachmentsTable.$inferSelect;
type MediaInsert = typeof mediaAttachmentsTable.$inferInsert;

export class MediaAttachmentPersistenceMapper {
  static toDomain(row: MediaRow): MediaAttachment {
    return MediaAttachment.reconstitute({
      id: row.id,
      taskId: row.taskId,
      uploadedBy: row.uploadedBy,
      mediaType: row.mediaType,
      originalFilename: row.originalFilename,
      storageKey: row.storageKey,
      mimeType: row.mimeType,
      fileSize: row.fileSize,
      durationSeconds: row.durationSeconds ?? undefined,
      width: row.width ?? undefined,
      height: row.height ?? undefined,
      thumbnailKey: row.thumbnailKey ?? undefined,
      checksum: row.checksum ?? undefined,
      deletedAt: row.deletedAt ?? undefined,
      uploadedAt: row.uploadedAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(media: MediaAttachment): MediaInsert {
    const primitives = media.toPrimitives();
    return {
      id: primitives.id,
      taskId: primitives.taskId,
      uploadedBy: primitives.uploadedBy,
      mediaType: primitives.mediaType,
      originalFilename: primitives.originalFilename,
      storageKey: primitives.storageKey,
      mimeType: primitives.mimeType,
      fileSize: primitives.fileSize,
      durationSeconds: primitives.durationSeconds ?? null,
      width: primitives.width ?? null,
      height: primitives.height ?? null,
      thumbnailKey: primitives.thumbnailKey ?? null,
      checksum: primitives.checksum ?? null,
      deletedAt: primitives.deletedAt ?? null,
      uploadedAt: primitives.uploadedAt,
      updatedAt: primitives.updatedAt,
    };
  }
}
