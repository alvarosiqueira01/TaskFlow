import { BaseEvent } from '../base-event';
import { EventType } from '../event-types';

export interface MediaUploadedPayload {
  mediaId: string;
  taskId: string;
  uploadedBy: string;
  mediaType: 'VIDEO' | 'AUDIO';
  s3Key: string;
  sizeInBytes: number;
}

export class MediaUploadedEvent extends BaseEvent<MediaUploadedPayload> {
  constructor(payload: MediaUploadedPayload, source: string, correlationId?: string) {
    super(EventType.MEDIA_UPLOADED, source, payload, correlationId);
  }
}
