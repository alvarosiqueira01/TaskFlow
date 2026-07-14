<script setup lang="ts">
import TaskCard from './TaskCard.vue';
import { getStatusOption } from '../constants/task-options';
import type { Task, TaskStatus } from '../types/task.types';

const props = defineProps<{ status: TaskStatus; tasks: Task[] }>();
const emit = defineEmits<{
  (e: 'open-task', taskId: string): void;
  (e: 'drop-task', payload: { taskId: string; status: TaskStatus }): void;
}>();

const statusOption = getStatusOption(props.status);

function handleDrop(event: DragEvent) {
  const taskId = event.dataTransfer?.getData('text/task-id');
  if (taskId) emit('drop-task', { taskId, status: props.status });
}
</script>

<template>
  <section class="kanban-column" @dragover.prevent @drop="handleDrop">
    <header class="kanban-column__header">
      <span class="kanban-column__dot" :style="{ backgroundColor: `var(--color-${statusOption.color})` }" />
      <h3 class="kanban-column__title">{{ statusOption.label }}</h3>
      <span class="kanban-column__count">{{ tasks.length }}</span>
    </header>

    <div class="kanban-column__body">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" @open="emit('open-task', $event)" />
      <p v-if="!tasks.length" class="kanban-column__empty">No tasks</p>
    </div>
  </section>
</template>

<style scoped>
.kanban-column {
  display: flex;
  flex-direction: column;
  min-width: 260px;
  background: var(--color-surface-subtle, #f9fafb);
  border-radius: 12px;
  padding: 12px;
  gap: 12px;
}
.kanban-column__header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.kanban-column__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.kanban-column__title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  flex: 1;
}
.kanban-column__count {
  font-size: 12px;
  color: var(--color-text-secondary, #6b7280);
}
.kanban-column__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 40px;
}
.kanban-column__empty {
  font-size: 12px;
  color: var(--color-text-secondary, #9ca3af);
  text-align: center;
  padding: 16px 0;
}
</style>
