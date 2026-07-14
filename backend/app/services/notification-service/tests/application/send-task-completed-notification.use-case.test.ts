import { SendTaskCompletedNotificationUseCase } from '../../src/application/use-cases/send-task-completed-notification.use-case.js';

function buildUseCase() {
  const userDirectoryRepository = {
    findById: jest.fn().mockResolvedValue({ id: 'owner-1', fullName: 'Owner Name', email: 'owner@example.com' }),
  };
  const emailSenderRepository = { send: jest.fn() };
  const notificationDeliveryRepository = { save: jest.fn() };

  const useCase = new SendTaskCompletedNotificationUseCase(
    userDirectoryRepository as any,
    emailSenderRepository as any,
    notificationDeliveryRepository as any,
  );

  return { useCase, emailSenderRepository, notificationDeliveryRepository };
}

describe('SendTaskCompletedNotificationUseCase', () => {
  it('notifies the task owner via email that the task was completed', async () => {
    const { useCase, emailSenderRepository, notificationDeliveryRepository } = buildUseCase();

    await useCase.execute({
      taskId: 'task-1',
      ownerId: 'owner-1',
      title: 'Ship release notes',
      completedAt: new Date().toISOString(),
    });

    expect(emailSenderRepository.send).toHaveBeenCalledWith(
      expect.objectContaining({ toAddress: 'owner@example.com', subject: 'Your task was completed' }),
    );

    const savedDelivery = notificationDeliveryRepository.save.mock.calls[0][0];
    expect(savedDelivery.toPrimitives().eventType.toString()).toBe('TASK_COMPLETED');
  });
});
