import { and, asc, eq, gt } from 'drizzle-orm';
import { NotificationPage, NotificationRepository } from '../../domain/repositories/notification.repository.js';
import { Notification } from '../../domain/entities/notification.entity.js';
import { NotificationType } from '../../domain/value-objects/notification-type.vo.js';
import { DrizzleClient } from '../database/drizzle/client.js';
import { notificationsTable } from '../database/drizzle/schema.js';

function decodeCursor(cursor: string | null | undefined): Date | undefined {
  if (!cursor) return undefined;
  return new Date(Buffer.from(cursor, 'base64url').toString('utf-8'));
}

function encodeCursor(date: Date): string {
  return Buffer.from(date.toISOString(), 'utf-8').toString('base64url');
}

export class DrizzleNotificationRepository implements NotificationRepository {
  constructor(private readonly db: DrizzleClient) {}

  private toRow(notification: Notification) {
    const primitives = notification.toPrimitives();
    return {
      id: primitives.id,
      userId: primitives.userId,
      taskId: primitives.taskId,
      commentId: primitives.commentId,
      type: primitives.type.toString(),
      title: primitives.title,
      message: primitives.message,
      isRead: primitives.isRead,
      createdAt: primitives.createdAt,
      readAt: primitives.readAt,
    };
  }

  async save(notification: Notification): Promise<void> {
    const row = this.toRow(notification);
    await this.db
      .insert(notificationsTable)
      .values(row)
      .onConflictDoUpdate({
        target: notificationsTable.id,
        set: { isRead: row.isRead, readAt: row.readAt },
      });
  }

  async saveMany(notifications: Notification[]): Promise<void> {
    if (notifications.length === 0) return;
    await this.db.insert(notificationsTable).values(notifications.map((notification) => this.toRow(notification)));
  }

  async findById(notificationId: string): Promise<Notification | null> {
    const rows = await this.db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.id, notificationId))
      .limit(1);

    if (rows.length === 0) return null;
    const row = rows[0];
    return Notification.restore({ ...row, type: NotificationType.create(row.type) });
  }

  async findByUserId(
    userId: string,
    limit: number,
    cursor?: string | null,
    isRead?: boolean,
  ): Promise<NotificationPage> {
    const afterDate = decodeCursor(cursor);

    const conditions = [eq(notificationsTable.userId, userId)];
    if (afterDate) conditions.push(gt(notificationsTable.createdAt, afterDate));
    if (isRead !== undefined) conditions.push(eq(notificationsTable.isRead, isRead));

    const rows = await this.db
      .select()
      .from(notificationsTable)
      .where(and(...conditions))
      .orderBy(asc(notificationsTable.createdAt))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const pageRows = hasMore ? rows.slice(0, limit) : rows;

    return {
      items: pageRows.map((row) => Notification.restore({ ...row, type: NotificationType.create(row.type) })),
      nextCursor: hasMore ? encodeCursor(pageRows[pageRows.length - 1].createdAt) : null,
    };
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.db
      .update(notificationsTable)
      .set({ isRead: true, readAt: new Date() })
      .where(and(eq(notificationsTable.userId, userId), eq(notificationsTable.isRead, false)));
  }
}
