import { DomainEvent } from './domain-event';

export interface MediaDeletedPayload {
  mediaId: string;
  taskId: string;
  deletedBy: string;
  storageKey: string;
}

export class MediaDeletedEvent implements DomainEvent<MediaDeletedPayload> {
  readonly eventType = 'MediaDeleted';
  readonly eventVersion = '1.0';
  readonly source = 'media-service';
  readonly occurredAt: Date;

  constructor(readonly payload: MediaDeletedPayload) {
    this.occurredAt = new Date();
  }
}
