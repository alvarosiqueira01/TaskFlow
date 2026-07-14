import { randomUUID } from 'node:crypto';
import { NotificationChannel } from '../value-objects/notification-channel.vo.js';
import { DeliveryStatus } from '../value-objects/delivery-status.vo.js';
import { NotificationEventType } from '../value-objects/notification-event-type.vo.js';

export interface NotificationDeliveryProps {
  id: string;
  eventType: NotificationEventType;
  channel: NotificationChannel;
  recipientUserId: string;
  taskId: string | null;
  commentId: string | null;
  subject: string;
  body: string;
  status: DeliveryStatus;
  failureReason: string | null;
  createdAt: Date;
  sentAt: Date | null;
}

export class NotificationDelivery {
  private constructor(private props: NotificationDeliveryProps) {}

  static create(input: {
    eventType: NotificationEventType;
    channel: NotificationChannel;
    recipientUserId: string;
    taskId?: string | null;
    commentId?: string | null;
    subject: string;
    body: string;
  }): NotificationDelivery {
    return new NotificationDelivery({
      id: randomUUID(),
      eventType: input.eventType,
      channel: input.channel,
      recipientUserId: input.recipientUserId,
      taskId: input.taskId ?? null,
      commentId: input.commentId ?? null,
      subject: input.subject,
      body: input.body,
      status: DeliveryStatus.pending(),
      failureReason: null,
      createdAt: new Date(),
      sentAt: null,
    });
  }

  static restore(props: NotificationDeliveryProps): NotificationDelivery {
    return new NotificationDelivery(props);
  }

  get id(): string {
    return this.props.id;
  }

  get status(): DeliveryStatus {
    return this.props.status;
  }

  markSent(): void {
    this.props.status = DeliveryStatus.sent();
    this.props.sentAt = new Date();
    this.props.failureReason = null;
  }

  markFailed(reason: string): void {
    this.props.status = DeliveryStatus.failed();
    this.props.failureReason = reason;
  }

  toPrimitives(): NotificationDeliveryProps {
    return { ...this.props };
  }
}
