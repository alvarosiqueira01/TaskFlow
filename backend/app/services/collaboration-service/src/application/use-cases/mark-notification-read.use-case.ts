import { NotificationRepository } from '../../domain/repositories/notification.repository.js';
import {
  ForbiddenNotificationAccessError,
  NotificationNotFoundError,
} from '../../domain/exceptions/collaboration.exceptions.js';
import { Notification } from '../../domain/entities/notification.entity.js';

export interface MarkNotificationReadCommand {
  notificationId: string;
  userId: string;
}

export class MarkNotificationReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(command: MarkNotificationReadCommand): Promise<Notification> {
    const notification = await this.notificationRepository.findById(command.notificationId);
    if (!notification) {
      throw new NotificationNotFoundError(command.notificationId);
    }

    if (!notification.belongsTo(command.userId)) {
      throw new ForbiddenNotificationAccessError();
    }

    notification.markAsRead();
    await this.notificationRepository.save(notification);

    return notification;
  }
}
