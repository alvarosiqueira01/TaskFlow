import { DomainEvent } from './event-publisher.port.js';

export interface CommentCreatedPayload {
  commentId: string;
  taskId: string;
  userId: string;
  content: string;
  parentCommentId: string | null;
  createdAt: string;
}

export class CommentCreatedEvent implements DomainEvent<CommentCreatedPayload> {
  eventName = 'CommentCreated' as const;
  eventVersion = '1.0' as const;
  occurredAt: Date;
  payload: CommentCreatedPayload;

  constructor(payload: CommentCreatedPayload) {
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
