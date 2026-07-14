<script setup lang="ts">
import { useNotificationFormatters } from '../composables/useNotificationFormatters';
import type { Notification } from '../types/notification.types';

defineProps<{
  notification: Notification;
  marking: boolean;
}>();

defineEmits<{
  (e: 'mark-read', id: string): void;
}>();

const { formatRelativeTime } = useNotificationFormatters();

const typeLabels: Record<Notification['type'], string> = {
  ASSIGNMENT: 'Assignment',
  TASK_UPDATED: 'Update',
  MENTION: 'Mention',
};
</script>

<template>
  <li
    class="notification-item"
    :class="{ 'notification-item--unread': !notification.isRead }"
    role="button"
    tabindex="0"
    @click="!notification.isRead && $emit('mark-read', notification.id)"
    @keydown.enter="!notification.isRead && $emit('mark-read', notification.id)"
  >
    <span class="notification-item__avatar" aria-hidden="true">
      {{ typeLabels[notification.type].charAt(0) }}
    </span>

    <div class="notification-item__body">
      <p class="notification-item__title">{{ notification.title }}</p>
      <p class="notification-item__message">{{ notification.message }}</p>
      <time class="notification-item__timestamp" :datetime="notification.createdAt">
        {{ formatRelativeTime(notification.createdAt) }}
      </time>
    </div>

    <span
      v-if="!notification.isRead"
      class="notification-item__dot"
      :class="{ 'notification-item__dot--busy': marking }"
      aria-label="Unread"
    />
  </li>
</template>

<style scoped>
.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
}

.notification-item:focus-visible {
  outline: 2px solid var(--color-primary-500, #3b82f6);
  outline-offset: 1px;
}

.notification-item--unread {
  background: var(--color-primary-50, #eff6ff);
}

.notification-item__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary-700, #1d4ed8);
  background: var(--color-primary-100, #dbeafe);
}

.notification-item__body {
  flex: 1;
  min-width: 0;
}

.notification-item__title {
  margin: 0 0 2px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.notification-item__message {
  margin: 0 0 4px;
  font-size: 13px;
  color: var(--color-text-muted, #6b7280);
}

.notification-item__timestamp {
  font-size: 12px;
  color: var(--color-text-muted, #6b7280);
}

.notification-item__dot {
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 999px;
  background: var(--color-primary-500, #3b82f6);
  flex-shrink: 0;
}

.notification-item__dot--busy {
  opacity: 0.4;
}
</style>
