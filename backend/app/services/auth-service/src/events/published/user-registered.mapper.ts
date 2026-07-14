import { UserRegisteredEvent as UserRegisteredIntegrationEvent, type UserRole } from '@backend/shared';
import type { UserRegisteredEvent } from '../../domain/events/user-registered.domain-event';

/**
 * Maps the pure Domain Event into the shared integration event
 * contract published to Amazon EventBridge.
 */
export function toIntegrationEvent(
  domainEvent: UserRegisteredEvent,
  source: string,
  correlationId?: string,
): UserRegisteredIntegrationEvent {
  return new UserRegisteredIntegrationEvent(
    {
      userId: domainEvent.userId,
      email: domainEvent.email,
      fullName: domainEvent.fullName,
      roles: [domainEvent.role as any],
    },
    source,
    correlationId,
  );
}
