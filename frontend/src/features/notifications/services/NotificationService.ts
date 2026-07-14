// Assumes a centralized Axios instance is exported from core/api, per
// Frontend Architecture Standard ("core/api/ - Axios instance, interceptors").
import { httpClient } from '@/core/api/http-client';
import type { Notification, NotificationType } from '../types/notification.types';

/** Mirrors components.schemas.CursorPaginatedResponse (allOf items). */
interface CursorPaginatedResponseDto<T> {
  limit: number;
  nextCursor: string | null;
  total?: number;
  items: T[];
}

/** Mirrors components.schemas.Notification. */
interface NotificationResponseDto {
  id: string;
  taskId?: string;
  commentId?: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface GetNotificationsParams {
  limit?: number;
  cursor?: string | null;
  isRead?: boolean;
}

export class NotificationService {
  /** GET /notifications */
  async getNotifications(
    params: GetNotificationsParams = {}
  ): Promise<CursorPaginatedResponseDto<Notification>> {
    const { data } = await httpClient.get<CursorPaginatedResponseDto<NotificationResponseDto>>(
      '/notifications',
      {
        params: {
          limit: params.limit,
          cursor: params.cursor ?? undefined,
          isRead: params.isRead,
        },
      }
    );
    return data;
  }

  /**
   * Derives the unread count from GET /notifications?isRead=false&limit=1,
   * reading the optional `total` field — the contract has no dedicated
   * unread-count endpoint.
   */
  async getUnreadCount(): Promise<number> {
    const { data } = await httpClient.get<CursorPaginatedResponseDto<NotificationResponseDto>>(
      '/notifications',
      { params: { isRead: false, limit: 1 } }
    );
    return data.total ?? data.items.length;
  }

  /** PATCH /notifications/{id}/read — 200 with no response body. */
  async markNotificationRead(id: string): Promise<void> {
    await httpClient.patch(`/notifications/${id}/read`);
  }

  /** PATCH /notifications/read-all — 200 with no response body. */
  async markAllNotificationsRead(): Promise<void> {
    await httpClient.patch('/notifications/read-all');
  }
}

export const notificationService = new NotificationService();
