import { DomainEvent } from './domain-event.base';
import type { UserRole } from '@backend/shared';

export class UserRegisteredEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly role: UserRole,
  ) {
    super('UserRegistered');
  }
}
