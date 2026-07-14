import { and, eq, isNull } from 'drizzle-orm';
import { DrizzleClient } from '../database/drizzle/client';
import { mediaAttachmentsTable } from '../database/drizzle/schema';
import {
  FindMediaOptions,
  MediaAttachmentRepository,
} from '../../domain/repositories/media-attachment.repository';
import { MediaAttachment } from '../../domain/entities/media-attachment.entity';
import { MediaAttachmentPersistenceMapper } from './mappers/media-attachment-persistence.mapper';

export class DrizzleMediaAttachmentRepository implements MediaAttachmentRepository {
  constructor(private readonly db: DrizzleClient) {}

  async save(media: MediaAttachment): Promise<void> {
    const row = MediaAttachmentPersistenceMapper.toPersistence(media);

    await this.db
      .insert(mediaAttachmentsTable)
      .values(row)
      .onConflictDoUpdate({
        target: mediaAttachmentsTable.id,
        set: {
          mediaType: row.mediaType,
          originalFilename: row.originalFilename,
          storageKey: row.storageKey,
          mimeType: row.mimeType,
          fileSize: row.fileSize,
          durationSeconds: row.durationSeconds,
          width: row.width,
          height: row.height,
          thumbnailKey: row.thumbnailKey,
          checksum: row.checksum,
          deletedAt: row.deletedAt,
          updatedAt: row.updatedAt,
        },
      });
  }

  async findById(id: string, options: FindMediaOptions = {}): Promise<MediaAttachment | null> {
    const conditions = [eq(mediaAttachmentsTable.id, id)];
    if (!options.includeDeleted) {
      conditions.push(isNull(mediaAttachmentsTable.deletedAt));
    }

    const rows = await this.db
      .select()
      .from(mediaAttachmentsTable)
      .where(and(...conditions))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    return MediaAttachmentPersistenceMapper.toDomain(rows[0]);
  }
}
