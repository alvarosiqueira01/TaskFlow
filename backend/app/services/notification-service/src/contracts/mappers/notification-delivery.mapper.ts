import { NotificationDelivery } from '../../domain/entities/notification-delivery.entity.js';
import { NotificationDeliveryLogEntry } from '../dtos/notification-delivery.dto.js';

/**
 * Used to produce structured CloudWatch log entries for each delivery
 * attempt (NFR-15 Centralized logs / FR-39 log significant actions).
 */
export class NotificationDeliveryMapper {
  static toLogEntry(notificationDelivery: NotificationDelivery): NotificationDeliveryLogEntry {
    const primitives = notificationDelivery.toPrimitives();
    return {
      id: primitives.id,
      eventType: primitives.eventType.toString(),
      channel: primitives.channel.toString(),
      recipientUserId: primitives.recipientUserId,
      taskId: primitives.taskId ?? undefined,
      commentId: primitives.commentId ?? undefined,
      status: primitives.status.toString(),
      failureReason: primitives.failureReason ?? undefined,
      createdAt: primitives.createdAt.toISOString(),
      sentAt: primitives.sentAt ? primitives.sentAt.toISOString() : undefined,
    };
  }
}
