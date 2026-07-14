import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import { notificationService } from '../services/NotificationService';
import { parseProblemDetails } from '../composables/useNotificationsErrorParser';
import type { NotificationState } from '../types/notification.types';

const DEFAULT_PAGE_SIZE = 20;

function createInitialState(): NotificationState {
  return {
    items: [],
    nextCursor: null,
    hasMore: true,
    isLoading: false,
    isLoadingMore: false,
    error: null,

    unreadCount: 0,
    isLoadingUnreadCount: false,

    isMarkingAllRead: false,
    markAllReadError: null,

    markingReadIds: [],
  };
}

export const useNotificationStore = defineStore('notifications', () => {
  const state = reactive<NotificationState>(createInitialState());

  async function loadFirstPage() {
    state.isLoading = true;
    state.error = null;
    try {
      const page = await notificationService.getNotifications({ limit: DEFAULT_PAGE_SIZE });
      state.items = page.items;
      state.nextCursor = page.nextCursor;
      state.hasMore = page.nextCursor !== null;
    } catch (err) {
      state.error = parseProblemDetails(err).title ?? 'Failed to load notifications.';
    } finally {
      state.isLoading = false;
    }
  }

  async function loadMore() {
    if (!state.hasMore || state.isLoadingMore) {
      return;
    }
    state.isLoadingMore = true;
    state.error = null;
    try {
      const page = await notificationService.getNotifications({
        limit: DEFAULT_PAGE_SIZE,
        cursor: state.nextCursor,
      });
      state.items = [...state.items, ...page.items];
      state.nextCursor = page.nextCursor;
      state.hasMore = page.nextCursor !== null;
    } catch (err) {
      state.error = parseProblemDetails(err).title ?? 'Failed to load more notifications.';
    } finally {
      state.isLoadingMore = false;
    }
  }

  async function loadUnreadCount() {
    state.isLoadingUnreadCount = true;
    try {
      state.unreadCount = await notificationService.getUnreadCount();
    } catch {
      // Non-critical — keep the previous count rather than surfacing a
      // banner for a background badge refresh.
    } finally {
      state.isLoadingUnreadCount = false;
    }
  }

  async function markAsRead(id: string) {
    if (state.markingReadIds.includes(id)) {
      return;
    }
    state.markingReadIds = [...state.markingReadIds, id];
    try {
      await notificationService.markNotificationRead(id);
      const target = state.items.find((item) => item.id === id);
      if (target && !target.isRead) {
        target.isRead = true;
        target.readAt = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    } catch (err) {
      state.error = parseProblemDetails(err).title ?? 'Failed to mark notification as read.';
    } finally {
      state.markingReadIds = state.markingReadIds.filter((markingId) => markingId !== id);
    }
  }

  async function markAllAsRead() {
    state.isMarkingAllRead = true;
    state.markAllReadError = null;
    try {
      await notificationService.markAllNotificationsRead();
      const now = new Date().toISOString();
      state.items = state.items.map((item) =>
        item.isRead ? item : { ...item, isRead: true, readAt: now }
      );
      state.unreadCount = 0;
    } catch (err) {
      state.markAllReadError = parseProblemDetails(err).title ?? 'Failed to mark all notifications as read.';
    } finally {
      state.isMarkingAllRead = false;
    }
  }

  function resetNotifications() {
    Object.assign(state, createInitialState());
  }

  return {
    ...toRefs(state),
    loadFirstPage,
    loadMore,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    resetNotifications,
  };
});
