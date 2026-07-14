<script setup lang="ts">
import { computed } from 'vue';
import BaseAvatar from '@/shared/components/BaseAvatar.vue';
import TaskPriorityBadge from './TaskPriorityBadge.vue';
import { formatDate } from '@/shared/utils/date.util';
import type { Task } from '../types/task.types';

const props = defineProps<{ task: Task }>();
const emit = defineEmits<{ (e: 'open', taskId: string): void }>();

const formattedDueDate = computed(() => (props.task.dueDate ? formatDate(props.task.dueDate) : null));
const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.status === 'COMPLETED') return false;
  return new Date(props.task.dueDate).getTime() < Date.now();
});

function handleDragStart(event: DragEvent) {
  event.dataTransfer?.setData('text/task-id', props.task.id);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
}
</script>

<template>
  <article
    class="task-card"
    :class="{ 'task-card--overdue': isOverdue }"
    draggable="true"
    role="button"
    tabindex="0"
    :aria-label="`Open task ${task.title}`"
    @dragstart="handleDragStart"
    @click="emit('open', task.id)"
    @keydown.enter="emit('open', task.id)"
  >
    <header class="task-card__header">
      <h4 class="task-card__title">{{ task.title }}</h4>
    </header>

    <div class="task-card__tags">
      <TaskPriorityBadge :priority="task.priority ?? 'MEDIUM'" />
    </div>

    <footer class="task-card__footer">
      <div class="task-card__assignees">
        <BaseAvatar
          v-for="assignee in (task.assignedUsers ?? []).slice(0, 3)"
          :key="assignee.id"
          :name="assignee.fullName ?? assignee.username"
          :src="assignee.avatarUrl"
          size="sm"
        />
      </div>
      <span v-if="formattedDueDate" class="task-card__due-date">{{ formattedDueDate }}</span>
    </footer>
  </article>
</template>

<style scoped>
.task-card {
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  padding: 12px;
  cursor: grab;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.task-card--overdue {
  border-color: var(--color-error, #dc2626);
}
.task-card__title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}
.task-card__tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.task-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.task-card__assignees {
  display: flex;
}
.task-card__due-date {
  font-size: 12px;
  color: var(--color-text-secondary, #6b7280);
}
</style>
