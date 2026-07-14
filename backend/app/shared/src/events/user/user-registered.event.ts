import { BaseEvent } from '../base-event';
import { EventType } from '../event-types';
import type { Role } from '../../types/roles';

export interface UserRegisteredPayload {
  userId: string;
  email: string;
  fullName: string;
  roles: Role[];
}

export class UserRegisteredEvent extends BaseEvent<UserRegisteredPayload> {
  constructor(payload: UserRegisteredPayload, source: string, correlationId?: string) {
    super(EventType.USER_REGISTERED, source, payload, correlationId);
  }
}
