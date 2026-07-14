import { Notification } from '../../domain/entities/notification.entity.js';
import { NotificationResponse } from '../dtos/notification.dto.js';

export class NotificationMapper {
  static toResponse(notification: Notification): NotificationResponse {
    const primitives = notification.toPrimitives();
    return {
      id: primitives.id,
      taskId: primitives.taskId ?? undefined,
      commentId: primitives.commentId ?? undefined,
      type: primitives.type.toString(),
      title: primitives.title,
      message: primitives.message,
      isRead: primitives.isRead,
      createdAt: primitives.createdAt.toISOString(),
      readAt: primitives.readAt ? primitives.readAt.toISOString() : undefined,
    };
  }
}
