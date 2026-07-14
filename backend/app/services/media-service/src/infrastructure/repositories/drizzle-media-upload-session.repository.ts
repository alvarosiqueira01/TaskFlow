import { eq } from 'drizzle-orm';
import { DrizzleClient } from '../database/drizzle/client';
import { mediaUploadSessionsTable } from '../database/drizzle/schema';
import { MediaUploadSessionRepository } from '../../domain/repositories/media-upload-session.repository';
import { MediaUploadSession } from '../../domain/entities/media-upload-session.entity';
import { UploadSessionPersistenceMapper } from './mappers/upload-session-persistence.mapper';

export class DrizzleMediaUploadSessionRepository implements MediaUploadSessionRepository {
  constructor(private readonly db: DrizzleClient) {}

  async save(session: MediaUploadSession): Promise<void> {
    const row = UploadSessionPersistenceMapper.toPersistence(session);

    await this.db
      .insert(mediaUploadSessionsTable)
      .values(row)
      .onConflictDoUpdate({
        target: mediaUploadSessionsTable.id,
        set: {
          status: row.status,
          completedAt: row.completedAt,
        },
      });
  }

  async findById(id: string): Promise<MediaUploadSession | null> {
    const rows = await this.db
      .select()
      .from(mediaUploadSessionsTable)
      .where(eq(mediaUploadSessionsTable.id, id))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    return UploadSessionPersistenceMapper.toDomain(rows[0]);
  }
}
