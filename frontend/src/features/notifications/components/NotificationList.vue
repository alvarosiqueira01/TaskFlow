<script setup lang="ts">
import NotificationListItem from './NotificationListItem.vue';
import type { Notification } from '../types/notification.types';

defineProps<{
  items: Notification[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  markingReadIds: string[];
}>();

defineEmits<{
  (e: 'retry'): void;
  (e: 'load-more'): void;
  (e: 'mark-read', id: string): void;
}>();
</script>

<template>
  <section class="notification-list" aria-label="Notification list">
    <div v-if="error" class="notification-list__error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="$emit('retry')">Try again</button>
    </div>

    <p v-else-if="!loading && items.length === 0" class="notification-list__empty">
      Nothing here yet.
    </p>

    <ul v-else class="notification-list__items">
      <template v-if="loading">
        <li v-for="n in 5" :key="`skeleton-${n}`" class="notification-list__skeleton">&nbsp;</li>
      </template>
      <template v-else>
        <NotificationListItem
          v-for="notification in items"
          :key="notification.id"
          :notification="notification"
          :marking="markingReadIds.includes(notification.id)"
          @mark-read="$emit('mark-read', $event)"
        />
      </template>
    </ul>

    <div v-if="!loading && hasMore" class="notification-list__load-more">
      <button type="button" :disabled="loadingMore" @click="$emit('load-more')">
        {{ loadingMore ? 'Loading…' : 'Load more' }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.notification-list {
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
}

.notification-list__items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-list__skeleton {
  height: 56px;
  border-radius: 8px;
  background: var(--color-border, #e5e7eb);
}

.notification-list__empty {
  margin: 0;
  padding: 16px 0;
  font-size: 13px;
  color: var(--color-text-muted, #6b7280);
}

.notification-list__error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--color-danger-50, #fef2f2);
  color: var(--color-danger-700, #b91c1c);
}

.notification-list__error button {
  border: none;
  background: transparent;
  color: inherit;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.notification-list__load-more {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.notification-list__load-more button {
  border: none;
  background: transparent;
  color: var(--color-primary-600, #2563eb);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.notification-list__load-more button:disabled {
  color: var(--color-text-muted, #6b7280);
  cursor: not-allowed;
}
</style>
