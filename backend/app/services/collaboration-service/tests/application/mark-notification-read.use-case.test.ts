import { MarkNotificationReadUseCase } from '../../src/application/use-cases/mark-notification-read.use-case.js';
import { Notification } from '../../src/domain/entities/notification.entity.js';
import { NotificationType } from '../../src/domain/value-objects/notification-type.vo.js';
import {
  ForbiddenNotificationAccessError,
  NotificationNotFoundError,
} from '../../src/domain/exceptions/collaboration.exceptions.js';

describe('MarkNotificationReadUseCase', () => {
  it('marks the notification as read when it belongs to the requester', async () => {
    const notification = Notification.create({
      userId: 'user-1',
      type: NotificationType.assignment(),
      title: 'Assigned',
      message: 'msg',
    });

    const notificationRepository = {
      save: jest.fn(),
      saveMany: jest.fn(),
      findById: jest.fn().mockResolvedValue(notification),
      findByUserId: jest.fn(),
      markAllAsRead: jest.fn(),
    };

    const useCase = new MarkNotificationReadUseCase(notificationRepository as any);
    const result = await useCase.execute({ notificationId: notification.id, userId: 'user-1' });

    expect(result.isRead).toBe(true);
    expect(notificationRepository.save).toHaveBeenCalledWith(notification);
  });

  it('throws NotificationNotFoundError when missing', async () => {
    const notificationRepository = {
      save: jest.fn(),
      saveMany: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      findByUserId: jest.fn(),
      markAllAsRead: jest.fn(),
    };

    const useCase = new MarkNotificationReadUseCase(notificationRepository as any);

    await expect(useCase.execute({ notificationId: 'missing', userId: 'user-1' })).rejects.toThrow(
      NotificationNotFoundError,
    );
  });

  it('throws ForbiddenNotificationAccessError when the notification belongs to another user', async () => {
    const notification = Notification.create({
      userId: 'user-1',
      type: NotificationType.assignment(),
      title: 'Assigned',
      message: 'msg',
    });

    const notificationRepository = {
      save: jest.fn(),
      saveMany: jest.fn(),
      findById: jest.fn().mockResolvedValue(notification),
      findByUserId: jest.fn(),
      markAllAsRead: jest.fn(),
    };

    const useCase = new MarkNotificationReadUseCase(notificationRepository as any);

    await expect(useCase.execute({ notificationId: notification.id, userId: 'user-2' })).rejects.toThrow(
      ForbiddenNotificationAccessError,
    );
  });
});
