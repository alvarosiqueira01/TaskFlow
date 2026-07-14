import { Notification } from '../../src/domain/entities/notification.entity.js';
import { NotificationType } from '../../src/domain/value-objects/notification-type.vo.js';

describe('Notification entity', () => {
  it('starts unread and can be marked as read', () => {
    const notification = Notification.create({
      userId: 'user-1',
      taskId: 'task-1',
      type: NotificationType.mention(),
      title: 'Mentioned',
      message: 'You were mentioned',
    });

    expect(notification.isRead).toBe(false);
    expect(notification.readAt).toBeNull();

    notification.markAsRead();

    expect(notification.isRead).toBe(true);
    expect(notification.readAt).toBeInstanceOf(Date);
  });

  it('is idempotent when marked as read twice', () => {
    const notification = Notification.create({
      userId: 'user-1',
      type: NotificationType.taskUpdated(),
      title: 'Updated',
      message: 'Task updated',
    });

    notification.markAsRead();
    const firstReadAt = notification.readAt;
    notification.markAsRead();

    expect(notification.readAt).toBe(firstReadAt);
  });

  it('validates ownership', () => {
    const notification = Notification.create({
      userId: 'user-1',
      type: NotificationType.assignment(),
      title: 'Assigned',
      message: 'You were assigned',
    });

    expect(notification.belongsTo('user-1')).toBe(true);
    expect(notification.belongsTo('user-2')).toBe(false);
  });
});
