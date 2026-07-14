import { MediaUploadSession } from '../../../domain/entities/media-upload-session.entity';
import { mediaUploadSessionsTable } from '../../database/drizzle/schema';

type SessionRow = typeof mediaUploadSessionsTable.$inferSelect;
type SessionInsert = typeof mediaUploadSessionsTable.$inferInsert;

export class UploadSessionPersistenceMapper {
  static toDomain(row: SessionRow): MediaUploadSession {
    return MediaUploadSession.reconstitute({
      id: row.id,
      taskId: row.taskId,
      uploadedBy: row.uploadedBy,
      originalFilename: row.originalFilename,
      contentType: row.contentType,
      fileSize: row.fileSize,
      storageKey: row.storageKey,
      multipart: row.multipart,
      s3MultipartUploadId: row.s3MultipartUploadId ?? undefined,
      status: row.status,
      createdAt: row.createdAt,
      expiresAt: row.expiresAt,
      completedAt: row.completedAt ?? undefined,
    });
  }

  static toPersistence(session: MediaUploadSession): SessionInsert {
    const primitives = session.toPrimitives();
    return {
      id: primitives.id,
      taskId: primitives.taskId,
      uploadedBy: primitives.uploadedBy,
      originalFilename: primitives.originalFilename,
      contentType: primitives.contentType,
      fileSize: primitives.fileSize,
      storageKey: primitives.storageKey,
      multipart: primitives.multipart,
      s3MultipartUploadId: primitives.s3MultipartUploadId ?? null,
      status: primitives.status,
      createdAt: primitives.createdAt,
      expiresAt: primitives.expiresAt,
      completedAt: primitives.completedAt ?? null,
    };
  }
}
