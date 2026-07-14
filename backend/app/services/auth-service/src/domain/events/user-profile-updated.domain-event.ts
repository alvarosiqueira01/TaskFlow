import { DomainEvent } from './domain-event.base';

export class UserProfileUpdatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly changedFields: string[],
  ) {
    super('UserProfileUpdated');
  }
}
