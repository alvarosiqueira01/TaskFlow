import { BaseEvent } from '../base-event';
import { EventType } from '../event-types';

export interface MediaDeletedPayload {
  mediaId: string;
  taskId: string;
  deletedBy: string;
}

export class MediaDeletedEvent extends BaseEvent<MediaDeletedPayload> {
  constructor(payload: MediaDeletedPayload, source: string, correlationId?: string) {
    super(EventType.MEDIA_DELETED, source, payload, correlationId);
  }
}
