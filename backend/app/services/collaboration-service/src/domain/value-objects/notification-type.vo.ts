export const NotificationTypeValues = ['ASSIGNMENT', 'TASK_UPDATED', 'MENTION'] as const;

export type NotificationTypeValue = (typeof NotificationTypeValues)[number];

export class NotificationType {
  private constructor(private readonly value: NotificationTypeValue) {}

  static create(value: string): NotificationType {
    if (!NotificationTypeValues.includes(value as NotificationTypeValue)) {
      throw new Error(`Invalid notification type: ${value}`);
    }
    return new NotificationType(value as NotificationTypeValue);
  }

  static assignment(): NotificationType {
    return new NotificationType('ASSIGNMENT');
  }

  static taskUpdated(): NotificationType {
    return new NotificationType('TASK_UPDATED');
  }

  static mention(): NotificationType {
    return new NotificationType('MENTION');
  }

  toString(): NotificationTypeValue {
    return this.value;
  }

  equals(other: NotificationType): boolean {
    return this.value === other.value;
  }
}
