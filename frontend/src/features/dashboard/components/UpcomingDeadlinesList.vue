<script setup lang="ts">
import { useDashboardFormatters } from '../composables/useDashboardFormatters';
import type { UpcomingDeadlineItem } from '../types/dashboard.types';

defineProps<{
  items: UpcomingDeadlineItem[];
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();

const { formatDueDate, isOverdue } = useDashboardFormatters();

const statusLabels: Record<UpcomingDeadlineItem['status'], string> = {
  BACKLOG: 'Backlog',
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  COMPLETED: 'Completed',
};
</script>

<template>
  <section class="upcoming-deadlines" aria-label="Upcoming deadlines">
    <header class="upcoming-deadlines__header">
      <h3>Upcoming Deadlines</h3>
    </header>

    <div v-if="error" class="upcoming-deadlines__error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="$emit('retry')">Try again</button>
    </div>

    <p v-else-if="!loading && items.length === 0" class="upcoming-deadlines__empty">
      No upcoming deadlines. New due dates will appear here.
    </p>

    <table v-else class="upcoming-deadlines__table">
      <thead>
        <tr>
          <th scope="col">Task</th>
          <th scope="col">Status</th>
          <th scope="col">Due</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading">
          <tr v-for="n in 4" :key="`skeleton-${n}`" class="upcoming-deadlines__row--skeleton">
            <td colspan="3">&nbsp;</td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="task in items" :key="task.id">
            <td class="upcoming-deadlines__title">{{ task.title }}</td>
            <td>
              <span class="upcoming-deadlines__status">{{ statusLabels[task.status] }}</span>
            </td>
            <td :class="{ 'upcoming-deadlines__due--overdue': isOverdue(task.dueDate) }">
              {{ formatDueDate(task.dueDate) }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.upcoming-deadlines {
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
}

.upcoming-deadlines__header h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.upcoming-deadlines__table {
  width: 100%;
  border-collapse: collapse;
}

.upcoming-deadlines__table th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: var(--color-text-muted, #6b7280);
  padding: 0 0 8px;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.upcoming-deadlines__table td {
  padding: 12px 0;
  font-size: 13px;
  color: var(--color-text, #111827);
  border-bottom: 1px solid var(--color-border, #f3f4f6);
}

.upcoming-deadlines__title {
  font-weight: 500;
}

.upcoming-deadlines__status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  background: var(--color-neutral-100, #f3f4f6);
  color: var(--color-text-muted, #6b7280);
}

.upcoming-deadlines__due--overdue {
  color: var(--color-danger-600, #dc2626);
  font-weight: 600;
}

.upcoming-deadlines__row--skeleton td {
  height: 20px;
  background: var(--color-border, #e5e7eb);
  border-radius: 4px;
}

.upcoming-deadlines__empty {
  margin: 0;
  padding: 16px 0;
  font-size: 13px;
  color: var(--color-text-muted, #6b7280);
}

.upcoming-deadlines__error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--color-danger-50, #fef2f2);
  color: var(--color-danger-700, #b91c1c);
}

.upcoming-deadlines__error button {
  border: none;
  background: transparent;
  color: inherit;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
</style>
