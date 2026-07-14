import { UserUpdatedEvent as UserUpdatedIntegrationEvent } from '@backend/shared';
import type { UserProfileUpdatedEvent } from '../../domain/events/user-profile-updated.domain-event';
import type { UserPasswordChangedEvent } from '../../domain/events/user-password-changed.domain-event';
import type { UserRolesUpdatedEvent } from '../../domain/events/user-roles-updated.domain-event';

type UserUpdatedDomainEvent = UserProfileUpdatedEvent | UserPasswordChangedEvent | UserRolesUpdatedEvent;

export function toIntegrationEvent(
  domainEvent: UserUpdatedDomainEvent,
  source: string,
  correlationId?: string,
): UserUpdatedIntegrationEvent {
  const changedFields =
    'changedFields' in domainEvent
      ? domainEvent.changedFields
      : 'roleIds' in domainEvent
        ? ['roles']
        : ['password'];

  return new UserUpdatedIntegrationEvent(
    { userId: domainEvent.userId, changedFields },
    source,
    correlationId,
  );
}
