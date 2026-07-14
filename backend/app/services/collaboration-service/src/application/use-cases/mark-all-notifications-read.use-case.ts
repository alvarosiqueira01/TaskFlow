import { NotificationRepository } from '../../domain/repositories/notification.repository.js';

export interface MarkAllNotificationsReadCommand {
  userId: string;
}

export class MarkAllNotificationsReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(command: MarkAllNotificationsReadCommand): Promise<void> {
    await this.notificationRepository.markAllAsRead(command.userId);
  }
}
