export const NotificationEventTypeValues = ['TASK_ASSIGNED', 'MENTION', 'TASK_COMPLETED'] as const;

export type NotificationEventTypeValue = (typeof NotificationEventTypeValues)[number];

/**
 * Identifies the originating domain event that triggered a delivery
 * attempt. Distinct from collaboration-service's Notification.type
 * (ASSIGNMENT/TASK_UPDATED/MENTION), since this bounded context tracks
 * delivery provenance rather than the in-app read-model category.
 */
export class NotificationEventType {
  private constructor(private readonly value: NotificationEventTypeValue) {}

  static create(value: string): NotificationEventType {
    if (!NotificationEventTypeValues.includes(value as NotificationEventTypeValue)) {
      throw new Error(`Invalid notification event type: ${value}`);
    }
    return new NotificationEventType(value as NotificationEventTypeValue);
  }

  static taskAssigned(): NotificationEventType {
    return new NotificationEventType('TASK_ASSIGNED');
  }

  static mention(): NotificationEventType {
    return new NotificationEventType('MENTION');
  }

  static taskCompleted(): NotificationEventType {
    return new NotificationEventType('TASK_COMPLETED');
  }

  toString(): NotificationEventTypeValue {
    return this.value;
  }
}
