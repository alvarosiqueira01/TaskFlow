import { DomainEvent } from './domain-event';

export interface MediaUploadRequestedPayload {
  uploadId: string;
  taskId: string;
  uploadedBy: string;
  storageKey: string;
  multipart: boolean;
}

export class MediaUploadRequestedEvent implements DomainEvent<MediaUploadRequestedPayload> {
  readonly eventType = 'MediaUploadRequested';
  readonly eventVersion = '1.0';
  readonly source = 'media-service';
  readonly occurredAt: Date;

  constructor(readonly payload: MediaUploadRequestedPayload) {
    this.occurredAt = new Date();
  }
}
