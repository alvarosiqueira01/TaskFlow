<script setup lang="ts">
import { useDashboardFormatters } from '../composables/useDashboardFormatters';
import type { RecentActivityItem } from '../types/dashboard.types';

defineProps<{
  items: RecentActivityItem[];
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();

const { formatRelativeTime } = useDashboardFormatters();

const typeLabels: Record<RecentActivityItem['type'], string> = {
  ASSIGNMENT: 'Assignment',
  TASK_UPDATED: 'Update',
  MENTION: 'Mention',
};
</script>

<template>
  <section class="recent-activity" aria-label="Recent activity">
    <header class="recent-activity__header">
      <h3>Recent Activity</h3>
    </header>

    <div v-if="error" class="recent-activity__error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="$emit('retry')">Try again</button>
    </div>

    <p v-else-if="!loading && items.length === 0" class="recent-activity__empty">
      No recent activity yet.
    </p>

    <ul v-else class="recent-activity__list">
      <template v-if="loading">
        <li v-for="n in 4" :key="`skeleton-${n}`" class="recent-activity__item recent-activity__item--skeleton">
          <span class="recent-activity__avatar" aria-hidden="true" />
          <div class="recent-activity__body">
            <span class="recent-activity__message">&nbsp;</span>
          </div>
        </li>
      </template>
      <template v-else>
        <li
          v-for="activity in items"
          :key="activity.id"
          class="recent-activity__item"
          :class="{ 'recent-activity__item--unread': !activity.isRead }"
        >
          <span class="recent-activity__avatar" aria-hidden="true">
            {{ typeLabels[activity.type].charAt(0) }}
          </span>
          <div class="recent-activity__body">
            <p class="recent-activity__message">{{ activity.message }}</p>
            <time class="recent-activity__timestamp" :datetime="activity.createdAt">
              {{ formatRelativeTime(activity.createdAt) }}
            </time>
          </div>
          <span v-if="!activity.isRead" class="recent-activity__dot" aria-label="Unread" />
        </li>
      </template>
    </ul>
  </section>
</template>

<style scoped>
.recent-activity {
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
}

.recent-activity__header h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.recent-activity__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recent-activity__item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
}

.recent-activity__avatar {
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

.recent-activity__item--skeleton .recent-activity__avatar {
  background: var(--color-border, #e5e7eb);
}

.recent-activity__body {
  flex: 1;
  min-width: 0;
}

.recent-activity__message {
  margin: 0 0 2px;
  font-size: 13px;
  color: var(--color-text, #111827);
}

.recent-activity__timestamp {
  font-size: 12px;
  color: var(--color-text-muted, #6b7280);
}

.recent-activity__dot {
  position: absolute;
  top: 4px;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--color-primary-500, #3b82f6);
}

.recent-activity__empty {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted, #6b7280);
}

.recent-activity__error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--color-danger-50, #fef2f2);
  color: var(--color-danger-700, #b91c1c);
}

.recent-activity__error button {
  border: none;
  background: transparent;
  color: inherit;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
</style>
