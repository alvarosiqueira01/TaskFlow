import { NotificationPage, NotificationRepository } from '../../domain/repositories/notification.repository.js';

export interface GetNotificationsQuery {
  userId: string;
  limit: number;
  cursor?: string | null;
  isRead?: boolean;
}

export class GetNotificationsUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(query: GetNotificationsQuery): Promise<NotificationPage> {
    return this.notificationRepository.findByUserId(query.userId, query.limit, query.cursor ?? null, query.isRead);
  }
}
