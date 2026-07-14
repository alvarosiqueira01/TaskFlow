import { NotificationDelivery } from '../../src/domain/entities/notification-delivery.entity.js';
import { NotificationChannel } from '../../src/domain/value-objects/notification-channel.vo.js';
import { NotificationEventType } from '../../src/domain/value-objects/notification-event-type.vo.js';

describe('NotificationDelivery entity', () => {
  it('starts as PENDING with no sentAt or failureReason', () => {
    const delivery = NotificationDelivery.create({
      eventType: NotificationEventType.taskAssigned(),
      channel: NotificationChannel.email(),
      recipientUserId: 'user-1',
      taskId: 'task-1',
      subject: 'Subject',
      body: 'Body',
    });

    const primitives = delivery.toPrimitives();
    expect(primitives.status.toString()).toBe('PENDING');
    expect(primitives.sentAt).toBeNull();
    expect(primitives.failureReason).toBeNull();
  });

  it('marks as SENT and stamps sentAt', () => {
    const delivery = NotificationDelivery.create({
      eventType: NotificationEventType.mention(),
      channel: NotificationChannel.email(),
      recipientUserId: 'user-1',
      subject: 'Subject',
      body: 'Body',
    });

    delivery.markSent();

    const primitives = delivery.toPrimitives();
    expect(primitives.status.toString()).toBe('SENT');
    expect(primitives.sentAt).toBeInstanceOf(Date);
  });

  it('marks as FAILED with a reason', () => {
    const delivery = NotificationDelivery.create({
      eventType: NotificationEventType.taskCompleted(),
      channel: NotificationChannel.push(),
      recipientUserId: 'user-1',
      subject: 'Subject',
      body: 'Body',
    });

    delivery.markFailed('SES throttling error');

    const primitives = delivery.toPrimitives();
    expect(primitives.status.toString()).toBe('FAILED');
    expect(primitives.status.isFailed()).toBe(true);
    expect(primitives.failureReason).toBe('SES throttling error');
  });
});
