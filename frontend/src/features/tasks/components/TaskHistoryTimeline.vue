<script setup lang="ts">
import { onMounted } from 'vue';
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue';
import BaseButton from '@/shared/components/BaseButton.vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import { useTaskHistory } from '../composables/useTaskHistory';
import { formatRelativeTime } from '@/shared/utils/date.util';

const props = defineProps<{ taskId: string }>();

const { history, isLoading, hasMore, error, loadHistory, loadMoreHistory } = useTaskHistory(props.taskId);

onMounted(loadHistory);

function describeEntry(action: string, fieldName?: string, oldValue?: string, newValue?: string) {
  if (fieldName && oldValue !== undefined && newValue !== undefined) {
    return `${fieldName} changed from "${oldValue}" to "${newValue}"`;
  }
  return action.replaceAll('_', ' ').toLowerCase();
}
</script>

<template>
  <section class="task-history">
    <h4 class="task-history__title">Activity</h4>

    <LoadingSkeleton v-if="isLoading" size="sm" />
    <EmptyState v-else-if="!history.length" title="No activity yet" description="Changes to this task will appear here." />

    <ol v-else class="task-history__list">
      <li v-for="entry in history" :key="entry.id" class="task-history__item">
        <span class="task-history__description">
          {{ describeEntry(entry.action, entry.fieldName, entry.oldValue, entry.newValue) }}
        </span>
        <span class="task-history__timestamp">{{ formatRelativeTime(entry.createdAt) }}</span>
      </li>
    </ol>

    <BaseButton v-if="hasMore" variant="neutral" @click="loadMoreHistory">Load more</BaseButton>

    <p v-if="error" class="task-history__error">{{ error }}</p>
  </section>
</template>

<style scoped>
.task-history {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.task-history__title {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
}
.task-history__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.task-history__item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-secondary, #6b7280);
}
.task-history__error {
  font-size: 12px;
  color: var(--color-error, #dc2626);
}
</style>
