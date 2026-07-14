import { DomainEvent } from './domain-event';

export interface MediaReplacedPayload {
  mediaId: string;
  taskId: string;
  replacedBy: string;
  previousStorageKey: string;
  newStorageKey: string;
}

export class MediaReplacedEvent implements DomainEvent<MediaReplacedPayload> {
  readonly eventType = 'MediaReplaced';
  readonly eventVersion = '1.0';
  readonly source = 'media-service';
  readonly occurredAt: Date;

  constructor(readonly payload: MediaReplacedPayload) {
    this.occurredAt = new Date();
  }
}
