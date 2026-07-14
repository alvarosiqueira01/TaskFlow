<script setup lang="ts">
defineProps<{
  unreadCount: number;
  isMarkingAllRead: boolean;
  markAllReadError: string | null;
}>();

defineEmits<{
  (e: 'mark-all-read'): void;
}>();
</script>

<template>
  <div class="notifications-header">
    <header class="notifications-header__row">
      <div class="notifications-header__titles">
        <h2>Notifications</h2>
        <span v-if="unreadCount > 0" class="notifications-header__unread-badge">
          {{ unreadCount }} unread
        </span>
      </div>

      <button
        type="button"
        class="notifications-header__mark-all"
        :disabled="isMarkingAllRead || unreadCount === 0"
        @click="$emit('mark-all-read')"
      >
        {{ isMarkingAllRead ? 'Marking…' : 'Mark all as read' }}
      </button>
    </header>

    <p v-if="markAllReadError" class="notifications-header__error" role="alert">
      {{ markAllReadError }}
    </p>
  </div>
</template>

<style scoped>
.notifications-header__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.notifications-header__titles {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notifications-header__titles h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.notifications-header__unread-badge {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: var(--color-primary-100, #dbeafe);
  color: var(--color-primary-700, #1d4ed8);
}

.notifications-header__mark-all {
  border: none;
  background: transparent;
  color: var(--color-primary-600, #2563eb);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.notifications-header__mark-all:disabled {
  color: var(--color-text-muted, #6b7280);
  cursor: not-allowed;
  text-decoration: none;
}

.notifications-header__error {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--color-danger-600, #dc2626);
}
</style>
