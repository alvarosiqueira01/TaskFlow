import { FastifyReply } from 'fastify';
import { AuthenticatedRequest } from '../middleware/authenticate.middleware.js';
import { GetNotificationsUseCase } from '../../application/use-cases/get-notifications.use-case.js';
import { MarkNotificationReadUseCase } from '../../application/use-cases/mark-notification-read.use-case.js';
import { MarkAllNotificationsReadUseCase } from '../../application/use-cases/mark-all-notifications-read.use-case.js';
import { NotificationMapper } from '../../contracts/mappers/notification.mapper.js';
import { HTTP_STATUS } from '../../config/constants.js';

interface NotificationsListQuery {
  limit: number;
  cursor?: string;
  isRead?: boolean;
}

export class NotificationController {
  constructor(
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllNotificationsReadUseCase: MarkAllNotificationsReadUseCase,
  ) {}

  async list(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    const { limit, cursor, isRead } = request.query as NotificationsListQuery;
    const user = request.user!;

    const page = await this.getNotificationsUseCase.execute({
      userId: user.id,
      limit,
      cursor,
      isRead,
    });

    await reply.status(HTTP_STATUS.OK).send({
      limit,
      nextCursor: page.nextCursor,
      items: page.items.map((notification) => NotificationMapper.toResponse(notification)),
    });
  }

  async markRead(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    const { id: notificationId } = request.params as { id: string };
    const user = request.user!;

    await this.markNotificationReadUseCase.execute({ notificationId, userId: user.id });

    await reply.status(HTTP_STATUS.OK).send();
  }

  async markAllRead(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    const user = request.user!;
    await this.markAllNotificationsReadUseCase.execute({ userId: user.id });
    await reply.status(HTTP_STATUS.OK).send();
  }
}
