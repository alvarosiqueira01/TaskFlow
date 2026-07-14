import { NotificationDeliveryRepository } from '../../domain/repositories/notification-delivery.repository.js';
import { NotificationDelivery } from '../../domain/entities/notification-delivery.entity.js';
import { DrizzleClient } from '../database/drizzle/client.js';
import { notificationDeliveriesTable } from '../database/drizzle/schema.js';

export class DrizzleNotificationDeliveryRepository implements NotificationDeliveryRepository {
  constructor(private readonly db: DrizzleClient) {}

  async save(notificationDelivery: NotificationDelivery): Promise<void> {
    const primitives = notificationDelivery.toPrimitives();

    await this.db
      .insert(notificationDeliveriesTable)
      .values({
        id: primitives.id,
        eventType: primitives.eventType.toString(),
        channel: primitives.channel.toString(),
        recipientUserId: primitives.recipientUserId,
        taskId: primitives.taskId,
        commentId: primitives.commentId,
        subject: primitives.subject,
        body: primitives.body,
        status: primitives.status.toString(),
        failureReason: primitives.failureReason,
        createdAt: primitives.createdAt,
        sentAt: primitives.sentAt,
      })
      .onConflictDoUpdate({
        target: notificationDeliveriesTable.id,
        set: {
          status: primitives.status.toString(),
          failureReason: primitives.failureReason,
          sentAt: primitives.sentAt,
        },
      });
  }
}
