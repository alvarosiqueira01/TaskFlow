import { SendTaskAssignedNotificationUseCase } from '../../src/application/use-cases/send-task-assigned-notification.use-case.js';
import { RecipientHasNoEmailError, RecipientNotFoundError } from '../../src/domain/exceptions/notification.exceptions.js';

function buildUseCase(overrides: Partial<{ recipient: any }> = {}) {
  const userDirectoryRepository = {
    findById: jest.fn().mockResolvedValue(
      overrides.recipient === undefined
        ? { id: 'user-2', fullName: 'Jane Doe', email: 'jane@example.com', pushToken: 'push-token-1' }
        : overrides.recipient,
    ),
  };
  const emailSenderRepository = { send: jest.fn() };
  const pushSenderRepository = { send: jest.fn() };
  const notificationDeliveryRepository = { save: jest.fn() };

  const useCase = new SendTaskAssignedNotificationUseCase(
    userDirectoryRepository as any,
    emailSenderRepository as any,
    pushSenderRepository as any,
    notificationDeliveryRepository as any,
  );

  return { useCase, userDirectoryRepository, emailSenderRepository, pushSenderRepository, notificationDeliveryRepository };
}

const basePayload = {
  taskId: 'task-1',
  taskTitle: 'Fix production bug',
  assignedUserId: 'user-2',
  assignedBy: 'owner-1',
  assignedAt: new Date().toISOString(),
};

describe('SendTaskAssignedNotificationUseCase', () => {
  it('sends an email and a push notification, persisting both delivery records as SENT', async () => {
    const { useCase, emailSenderRepository, pushSenderRepository, notificationDeliveryRepository } = buildUseCase();

    await useCase.execute(basePayload);

    expect(emailSenderRepository.send).toHaveBeenCalledWith(
      expect.objectContaining({ toAddress: 'jane@example.com' }),
    );
    expect(pushSenderRepository.send).toHaveBeenCalledWith(
      expect.objectContaining({ deviceToken: 'push-token-1' }),
    );
    expect(notificationDeliveryRepository.save).toHaveBeenCalledTimes(2);
  });

  it('skips push delivery when the recipient has no pushToken', async () => {
    const { useCase, pushSenderRepository, notificationDeliveryRepository } = buildUseCase({
      recipient: { id: 'user-2', fullName: 'Jane Doe', email: 'jane@example.com' },
    });

    await useCase.execute(basePayload);

    expect(pushSenderRepository.send).not.toHaveBeenCalled();
    expect(notificationDeliveryRepository.save).toHaveBeenCalledTimes(1);
  });

  it('persists a FAILED delivery record when the email sender throws', async () => {
    const { useCase, emailSenderRepository, notificationDeliveryRepository } = buildUseCase({
      recipient: { id: 'user-2', fullName: 'Jane Doe', email: 'jane@example.com' },
    });
    emailSenderRepository.send.mockRejectedValueOnce(new Error('SES unavailable'));

    await useCase.execute(basePayload);

    const savedDelivery = notificationDeliveryRepository.save.mock.calls[0][0];
    expect(savedDelivery.toPrimitives().status.toString()).toBe('FAILED');
    expect(savedDelivery.toPrimitives().failureReason).toBe('SES unavailable');
  });

  it('throws RecipientNotFoundError when the user directory has no record', async () => {
    const { useCase } = buildUseCase({ recipient: null });

    await expect(useCase.execute(basePayload)).rejects.toThrow(RecipientNotFoundError);
  });

  it('throws RecipientHasNoEmailError when the recipient has no email on file', async () => {
    const { useCase } = buildUseCase({ recipient: { id: 'user-2', fullName: 'Jane Doe', email: '' } });

    await expect(useCase.execute(basePayload)).rejects.toThrow(RecipientHasNoEmailError);
  });
});
