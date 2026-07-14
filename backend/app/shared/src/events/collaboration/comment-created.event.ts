import { BaseEvent } from '../base-event';
import { EventType } from '../event-types';

export interface CommentCreatedPayload {
  commentId: string;
  taskId: string;
  authorId: string;
  mentionedUserIds: string[];
}

export class CommentCreatedEvent extends BaseEvent<CommentCreatedPayload> {
  constructor(payload: CommentCreatedPayload, source: string, correlationId?: string) {
    super(EventType.COMMENT_CREATED, source, payload, correlationId);
  }
}
