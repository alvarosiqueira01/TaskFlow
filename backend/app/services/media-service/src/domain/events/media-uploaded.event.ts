import { DomainEvent } from './domain-event';

export interface MediaUploadedPayload {
  mediaId: string;
  taskId: string;
  uploadedBy: string;
  mediaType: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
}

export class MediaUploadedEvent implements DomainEvent<MediaUploadedPayload> {
  readonly eventType = 'MediaUploaded';
  readonly eventVersion = '1.0';
  readonly source = 'media-service';
  readonly occurredAt: Date;

  constructor(readonly payload: MediaUploadedPayload) {
    this.occurredAt = new Date();
  }
}
