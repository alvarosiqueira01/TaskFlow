import { EventBridgeEvent } from 'aws-lambda';
import { loadEnv } from '../../../config/env';
import { createDrizzleClient } from '../../database/drizzle/client';
import { DrizzleMediaAttachmentRepository } from '../../repositories/drizzle-media-attachment.repository';
import { ThumbnailGeneratedDetail } from '../../../events/media-event-catalog';

/**
 * Dedicated EventBridge-triggered Lambda entry point that consumes the externally
 * published `ThumbnailGenerated` event (produced by the Thumbnail Processor Lambda,
 * per (A3)arquitecture.md §9 and (A5)streaming-design.md §11-12), and updates the
 * corresponding MediaAttachment with its thumbnail key.
 */
export const handler = async (
  event: EventBridgeEvent<'ThumbnailGenerated', ThumbnailGeneratedDetail['payload']>,
): Promise<void> => {
  const env = loadEnv();
  const { db, pool } = createDrizzleClient(env.DATABASE_URL);

  try {
    const mediaRepository = new DrizzleMediaAttachmentRepository(db);
    const { mediaId, thumbnailKey } = event.detail;

    const media = await mediaRepository.findById(mediaId, { includeDeleted: true });
    if (!media || media.isDeleted()) {
      return;
    }

    media.updateThumbnail(thumbnailKey);
    await mediaRepository.save(media);
  } finally {
    await pool.end();
  }
};
