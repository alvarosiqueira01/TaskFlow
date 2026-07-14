import { GetNotificationsUseCase } from '../../src/application/use-cases/get-notifications.use-case.js';

describe('GetNotificationsUseCase', () => {
  it('delegates pagination parameters to the repository', async () => {
    const notificationRepository = {
      save: jest.fn(),
      saveMany: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn().mockResolvedValue({ items: [], nextCursor: null }),
      markAllAsRead: jest.fn(),
    };

    const useCase = new GetNotificationsUseCase(notificationRepository as any);
    await useCase.execute({ userId: 'user-1', limit: 10, cursor: 'abc', isRead: false });

    expect(notificationRepository.findByUserId).toHaveBeenCalledWith('user-1', 10, 'abc', false);
  });
});
