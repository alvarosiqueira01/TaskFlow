import { Notification } from '../entities/notification.entity.js';

export interface NotificationPage {
  items: Notification[];
  nextCursor: string | null;
}

export interface NotificationRepository {
  save(notification: Notification): Promise<void>;
  saveMany(notifications: Notification[]): Promise<void>;
  findById(notificationId: string): Promise<Notification | null>;
  findByUserId(userId: string, limit: number, cursor?: string | null, isRead?: boolean): Promise<NotificationPage>;
  markAllAsRead(userId: string): Promise<void>;
}
