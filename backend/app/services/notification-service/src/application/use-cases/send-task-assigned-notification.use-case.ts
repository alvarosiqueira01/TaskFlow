import { NotificationDelivery } from '../../domain/entities/notification-delivery.entity.js';
import { NotificationChannel } from '../../domain/value-objects/notification-channel.vo.js';
import { NotificationEventType } from '../../domain/value-objects/notification-event-type.vo.js';
import { NotificationDeliveryRepository } from '../../domain/repositories/notification-delivery.repository.js';
import { UserDirectoryRepository } from '../../domain/repositories/user-directory.repository.js';
import { EmailSenderRepository } from '../../domain/repositories/email-sender.repository.js';
import { PushSenderRepository } from '../../domain/repositories/push-sender.repository.js';
import { RecipientHasNoEmailError, RecipientNotFoundError } from '../../domain/exceptions/notification.exceptions.js';
import { TaskAssignedEventPayload } from '../../events/consumed/task-assigned.event-schema.js';

export class SendTaskAssignedNotificationUseCase {
  constructor(
    private readonly userDirectoryRepository: UserDirectoryRepository,
    private readonly emailSenderRepository: EmailSenderRepository,
    private readonly pushSenderRepository: PushSenderRepository,
    private readonly notificationDeliveryRepository: NotificationDeliveryRepository,
  ) {}

  async execute(payload: TaskAssignedEventPayload): Promise<void> {
    const recipient = await this.userDirectoryRepository.findById(payload.assignedUserId);
    if (!recipient) {
      throw new RecipientNotFoundError(payload.assignedUserId);
    }
    if (!recipient.email) {
      throw new RecipientHasNoEmailError(payload.assignedUserId);
    }

    const subject = 'You were assigned to a task';
    const body = `Hi ${recipient.fullName}, you were assigned to task "${payload.taskTitle}".`;

    const emailDelivery = NotificationDelivery.create({
      eventType: NotificationEventType.taskAssigned(),
      channel: NotificationChannel.email(),
      recipientUserId: payload.assignedUserId,
      taskId: payload.taskId,
      subject,
      body,
    });

    try {
      await this.emailSenderRepository.send({ toAddress: recipient.email, subject, body });
      emailDelivery.markSent();
    } catch (error) {
      emailDelivery.markFailed(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      await this.notificationDeliveryRepository.save(emailDelivery);
    }

    if (recipient.pushToken) {
      const pushDelivery = NotificationDelivery.create({
        eventType: NotificationEventType.taskAssigned(),
        channel: NotificationChannel.push(),
        recipientUserId: payload.assignedUserId,
        taskId: payload.taskId,
        subject,
        body,
      });

      try {
        await this.pushSenderRepository.send({ deviceToken: recipient.pushToken, title: subject, body });
        pushDelivery.markSent();
      } catch (error) {
        pushDelivery.markFailed(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        await this.notificationDeliveryRepository.save(pushDelivery);
      }
    }
  }
}
