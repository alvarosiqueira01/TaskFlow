export const NotificationChannelValues = ['EMAIL', 'PUSH'] as const;

export type NotificationChannelValue = (typeof NotificationChannelValues)[number];

export class NotificationChannel {
  private constructor(private readonly value: NotificationChannelValue) {}

  static create(value: string): NotificationChannel {
    if (!NotificationChannelValues.includes(value as NotificationChannelValue)) {
      throw new Error(`Invalid notification channel: ${value}`);
    }
    return new NotificationChannel(value as NotificationChannelValue);
  }

  static email(): NotificationChannel {
    return new NotificationChannel('EMAIL');
  }

  static push(): NotificationChannel {
    return new NotificationChannel('PUSH');
  }

  toString(): NotificationChannelValue {
    return this.value;
  }

  equals(other: NotificationChannel): boolean {
    return this.value === other.value;
  }
}
