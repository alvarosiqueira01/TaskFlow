import { BaseEvent } from '../base-event';
import { EventType } from '../event-types';

export interface MentionCreatedPayload {
  commentId: string;
  taskId: string;
  mentionedUserId: string;
  mentionedBy: string;
}

export class MentionCreatedEvent extends BaseEvent<MentionCreatedPayload> {
  constructor(payload: MentionCreatedPayload, source: string, correlationId?: string) {
    super(EventType.MENTION_CREATED, source, payload, correlationId);
  }
}
