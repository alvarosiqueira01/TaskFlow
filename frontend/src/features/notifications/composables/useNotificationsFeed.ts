import { computed, onMounted, ref } from 'vue';
import { useNotificationStore } from '../store/notification.store';
import type { Notification, NotificationTab } from '../types/notification.types';

function matchesTab(notification: Notification, tab: NotificationTab): boolean {
  switch (tab) {
    case 'MENTIONS':
      return notification.type === 'MENTION';
    case 'ASSIGNMENTS':
      return notification.type === 'ASSIGNMENT';
    case 'COMMENTS':
      // The contract has no dedicated "comment" notification type;
      // comment-related notifications are identified by the presence of
      // a commentId instead.
      return Boolean(notification.commentId);
    case 'ALL':
    default:
      return true;
  }
}

export function useNotificationsFeed() {
  const store = useNotificationStore();
  const activeTab = ref<NotificationTab>('ALL');

  onMounted(() => {
    if (store.items.length === 0) {
      store.loadFirstPage();
    }
    store.loadUnreadCount();
  });

  const filteredItems = computed(() =>
    store.items.filter((item) => matchesTab(item, activeTab.value))
  );

  function setActiveTab(tab: NotificationTab) {
    activeTab.value = tab;
  }

  return {
    activeTab,
    setActiveTab,
    items: filteredItems,

    isLoading: computed(() => store.isLoading),
    isLoadingMore: computed(() => store.isLoadingMore),
    hasMore: computed(() => store.hasMore),
    error: computed(() => store.error),

    unreadCount: computed(() => store.unreadCount),

    isMarkingAllRead: computed(() => store.isMarkingAllRead),
    markAllReadError: computed(() => store.markAllReadError),

    markingReadIds: computed(() => store.markingReadIds),

    reload: store.loadFirstPage,
    loadMore: store.loadMore,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
  };
}
