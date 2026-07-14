import { SendMentionNotificationUseCase } from '../../src/application/use-cases/send-mention-notification.use-case.js';

function buildUseCase() {
  const userDirectoryRepository = {
    findById: jest.fn().mockResolvedValue({ id: 'user-3', fullName: 'Alex Smith', email: 'alex@example.com' }),
  };
  const emailSenderRepository = { send: jest.fn() };
  const pushSenderRepository = { send: jest.fn() };
  const notificationDeliveryRepository = { save: jest.fn() };

  const useCase = new SendMentionNotificationUseCase(
    userDirectoryRepository as any,
    emailSenderRepository as any,
    pushSenderRepository as any,
    notificationDeliveryRepository as any,
  );

  return { useCase, emailSenderRepository, notificationDeliveryRepository };
}

describe('SendMentionNotificationUseCase', () => {
  it('sends an email notification referencing the mentioning comment and task', async () => {
    const { useCase, emailSenderRepository, notificationDeliveryRepository } = buildUseCase();

    await useCase.execute({
      commentId: 'comment-1',
      taskId: 'task-1',
      mentionedUserId: 'user-3',
      mentionedBy: 'user-1',
      createdAt: new Date().toISOString(),
    });

    expect(emailSenderRepository.send).toHaveBeenCalledWith(
      expect.objectContaining({ toAddress: 'alex@example.com', subject: 'You were mentioned in a comment' }),
    );

    const savedDelivery = notificationDeliveryRepository.save.mock.calls[0][0];
    const primitives = savedDelivery.toPrimitives();
    expect(primitives.commentId).toBe('comment-1');
    expect(primitives.status.toString()).toBe('SENT');
  });
});
