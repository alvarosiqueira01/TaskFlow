<script setup lang="ts">
import type { NotificationTab } from '../types/notification.types';

defineProps<{
  activeTab: NotificationTab;
}>();

defineEmits<{
  (e: 'change', tab: NotificationTab): void;
}>();

const tabs: Array<{ value: NotificationTab; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'MENTIONS', label: 'Mentions' },
  { value: 'ASSIGNMENTS', label: 'Assignments' },
  { value: 'COMMENTS', label: 'Comments' },
];
</script>

<template>
  <nav class="notification-tabs" aria-label="Filter notifications">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      class="notification-tabs__tab"
      :class="{ 'notification-tabs__tab--active': activeTab === tab.value }"
      :aria-pressed="activeTab === tab.value"
      @click="$emit('change', tab.value)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<style scoped>
.notification-tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.notification-tabs__tab {
  padding: 8px 4px;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted, #6b7280);
  cursor: pointer;
}

.notification-tabs__tab--active {
  color: var(--color-primary-600, #2563eb);
  border-bottom-color: var(--color-primary-600, #2563eb);
}
</style>
