import { BaseEvent } from '../base-event';
import { EventType } from '../event-types';

export interface ThumbnailGeneratedPayload {
  mediaId: string;
  taskId: string;
  thumbnailS3Key: string;
}

export class ThumbnailGeneratedEvent extends BaseEvent<ThumbnailGeneratedPayload> {
  constructor(payload: ThumbnailGeneratedPayload, source: string, correlationId?: string) {
    super(EventType.THUMBNAIL_GENERATED, source, payload, correlationId);
  }
}
