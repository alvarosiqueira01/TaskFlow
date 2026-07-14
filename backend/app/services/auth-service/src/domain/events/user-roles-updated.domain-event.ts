import { DomainEvent } from './domain-event.base';

export class UserRolesUpdatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly roleIds: string[],
  ) {
    super('UserRolesUpdated');
  }
}
