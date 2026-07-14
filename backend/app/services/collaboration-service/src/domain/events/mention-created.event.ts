import { DomainEvent } from './event-publisher.port.js';

export interface MentionCreatedPayload {
  commentId: string;
  taskId: string;
  mentionedUserId: string;
  mentionedBy: string;
  createdAt: string;
}

export class MentionCreatedEvent implements DomainEvent<MentionCreatedPayload> {
  eventName = 'MentionCreated' as const;
  eventVersion = '1.0' as const;
  occurredAt: Date;
  payload: MentionCreatedPayload;

  constructor(payload: MentionCreatedPayload) {
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
