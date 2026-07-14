import { setActivePinia, createPinia } from 'pinia';
import { useNotificationStore } from './notification.store';
import { notificationService } from '../services/NotificationService';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('../services/NotificationService');

describe('notification.store.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('marks all notifications as read and resets unreadCount', async () => {
    const store = useNotificationStore();
    store.items = [
      { id: '1', type: 'MENTION', title: 'A', message: 'B', isRead: false, createdAt: '2026' },
      { id: '2', type: 'ASSIGNMENT', title: 'C', message: 'D', isRead: true, createdAt: '2026' },
    ];
    store.unreadCount = 1;

    (notificationService.markAllNotificationsRead as Mock).mockResolvedValue(undefined);

    await store.markAllAsRead();

    expect(notificationService.markAllNotificationsRead).toHaveBeenCalled();
    expect(store.items[0].isRead).toBe(true);
    expect(store.items[1].isRead).toBe(true);
    expect(store.unreadCount).toBe(0);
    expect(store.isMarkingAllRead).toBe(false);
  });
});
