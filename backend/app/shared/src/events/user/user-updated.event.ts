import { BaseEvent } from '../base-event';
import { EventType } from '../event-types';

export interface UserUpdatedPayload {
  userId: string;
  changedFields: string[];
}

export class UserUpdatedEvent extends BaseEvent<UserUpdatedPayload> {
  constructor(payload: UserUpdatedPayload, source: string, correlationId?: string) {
    super(EventType.USER_UPDATED, source, payload, correlationId);
  }
}
