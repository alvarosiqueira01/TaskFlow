import { NotificationDelivery } from '../../domain/entities/notification-delivery.entity.js';
import { NotificationChannel } from '../../domain/value-objects/notification-channel.vo.js';
import { NotificationEventType } from '../../domain/value-objects/notification-event-type.vo.js';
import { NotificationDeliveryRepository } from '../../domain/repositories/notification-delivery.repository.js';
import { UserDirectoryRepository } from '../../domain/repositories/user-directory.repository.js';
import { EmailSenderRepository } from '../../domain/repositories/email-sender.repository.js';
import { RecipientHasNoEmailError, RecipientNotFoundError } from '../../domain/exceptions/notification.exceptions.js';
import { TaskCompletedEventPayload } from '../../events/consumed/task-completed.event-schema.js';

export class SendTaskCompletedNotificationUseCase {
  constructor(
    private readonly userDirectoryRepository: UserDirectoryRepository,
    private readonly emailSenderRepository: EmailSenderRepository,
    private readonly notificationDeliveryRepository: NotificationDeliveryRepository,
  ) {}

  async execute(payload: TaskCompletedEventPayload): Promise<void> {
    const recipient = await this.userDirectoryRepository.findById(payload.ownerId);
    if (!recipient) {
      throw new RecipientNotFoundError(payload.ownerId);
    }
    if (!recipient.email) {
      throw new RecipientHasNoEmailError(payload.ownerId);
    }

    const subject = 'Your task was completed';
    const body = `Hi ${recipient.fullName}, task "${payload.title}" was marked as completed.`;

    const emailDelivery = NotificationDelivery.create({
      eventType: NotificationEventType.taskCompleted(),
      channel: NotificationChannel.email(),
      recipientUserId: payload.ownerId,
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
  }
}
