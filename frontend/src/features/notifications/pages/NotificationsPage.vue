<script setup lang="ts">
import { useNotificationsFeed } from '../composables/useNotificationsFeed';
import NotificationsHeader from '../components/NotificationsHeader.vue';
import NotificationTabs from '../components/NotificationTabs.vue';
import NotificationList from '../components/NotificationList.vue';

const {
  activeTab,
  setActiveTab,
  items,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  unreadCount,
  isMarkingAllRead,
  markAllReadError,
  markingReadIds,
  reload,
  loadMore,
  markAsRead,
  markAllAsRead,
} = useNotificationsFeed();
</script>

<template>
  <div class="notifications-page">
    <NotificationsHeader
      :unread-count="unreadCount"
      :is-marking-all-read="isMarkingAllRead"
      :mark-all-read-error="markAllReadError"
      @mark-all-read="markAllAsRead"
    />

    <NotificationTabs :active-tab="activeTab" @change="setActiveTab" />

    <NotificationList
      :items="items"
      :loading="isLoading"
      :loading-more="isLoadingMore"
      :has-more="hasMore"
      :error="error"
      :marking-read-ids="markingReadIds"
      @retry="reload"
      @load-more="loadMore"
      @mark-read="markAsRead"
    />
  </div>
</template>

<style scoped>
.notifications-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  max-width: 720px;
}
</style>
