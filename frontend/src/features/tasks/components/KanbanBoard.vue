<script setup lang="ts">
import KanbanColumn from './KanbanColumn.vue';
import { KANBAN_COLUMNS } from '../constants/task-options';
import type { Task, TaskStatus } from '../types/task.types';

const props = defineProps<{ tasks: Task[] }>();
const emit = defineEmits<{
  (e: 'open-task', taskId: string): void;
  (e: 'move-task', payload: { taskId: string; status: TaskStatus }): void;
}>();

function tasksForStatus(status: TaskStatus) {
  return props.tasks.filter((task) => task.status === status);
}
</script>

<template>
  <div class="kanban-board">
    <KanbanColumn
      v-for="status in KANBAN_COLUMNS"
      :key="status"
      :status="status"
      :tasks="tasksForStatus(status)"
      @open-task="emit('open-task', $event)"
      @drop-task="emit('move-task', $event)"
    />
  </div>
</template>

<style scoped>
.kanban-board {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}
</style>
