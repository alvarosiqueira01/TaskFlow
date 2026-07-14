<script setup lang="ts">
import { computed } from 'vue';
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue';
import BaseButton from '@/shared/components/BaseButton.vue';
import TaskMetadata from './TaskMetadata.vue';
import TaskAssigneeSelector from './TaskAssigneeSelector.vue';
import TaskHistoryTimeline from './TaskHistoryTimeline.vue';
import { useTaskStore } from '../store/taskStore';
import type { Task, TaskPriority, TaskStatus } from '../types/task.types';

import MediaAttachmentList from '@/features/media/components/MediaAttachmentList.vue';
import CommentThread from '@/features/collaboration/components/CommentThread.vue';
import type { CategoryOption } from '../types/category-option.types';

const props = defineProps<{
  isOpen: boolean;
  task: Task | null;
  isLoading: boolean;
  categoryOptions: CategoryOption[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'edit', task: Task): void;
  (e: 'delete', taskId: string): void;
}>();

const taskStore = useTaskStore();
const isUpdating = computed(() => taskStore.isMutating);

async function handleStatusUpdate(status: TaskStatus) {
  if (!props.task) return;
  await taskStore.updateTaskStatus(props.task.id, status);
}

async function handlePriorityUpdate(priority: TaskPriority) {
  if (!props.task) return;
  const current = props.task;
  await taskStore.updateTask(current.id, {
    title: current.title,
    description: current.description,
    categoryId: current.categoryId,
    status: current.status,
    priority,
    visibility: current.visibility,
    dueDate: current.dueDate,
    archived: current.archived,
  });
}

async function handleDueDateUpdate(dueDate: string | undefined) {
  if (!props.task) return;
  const current = props.task;
  await taskStore.updateTask(current.id, {
    title: current.title,
    description: current.description,
    categoryId: current.categoryId,
    status: current.status,
    priority: current.priority,
    visibility: current.visibility,
    dueDate,
    archived: current.archived,
  });
}
</script>

<template>
  <transition name="drawer-fade">
    <div v-if="isOpen" class="task-details-drawer__overlay" @click.self="emit('close')">
      <aside class="task-details-drawer" role="dialog" aria-modal="true" :aria-label="task ? task.title : 'Task details'">
        <LoadingSkeleton v-if="isLoading || !task" />

        <template v-else>
          <header class="task-details-drawer__header">
            <h2 class="task-details-drawer__title">{{ task.title }}</h2>
            <div class="task-details-drawer__actions">
              <BaseButton variant="neutral" @click="emit('edit', task)">Edit</BaseButton>
              <BaseButton variant="neutral" @click="emit('delete', task.id)">Delete</BaseButton>
              <button type="button" class="task-details-drawer__close" aria-label="Close" @click="emit('close')">×</button>
            </div>
          </header>

          <MediaAttachmentList :task-id="task.id" />

          <p v-if="task.description" class="task-details-drawer__description">{{ task.description }}</p>

          <TaskMetadata
            :task="task"
            :category-options="categoryOptions"
            :is-updating="isUpdating"
            @update-status="handleStatusUpdate"
            @update-priority="handlePriorityUpdate"
            @update-due-date="handleDueDateUpdate"
          />

          <TaskAssigneeSelector :task-id="task.id" :initial-assignees="task.assignedUsers ?? []" />

          <CommentThread :task-id="task.id" />

          <TaskHistoryTimeline :task-id="task.id" />
        </template>
      </aside>
    </div>
  </transition>
</template>

<style scoped>
.task-details-drawer__overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  justify-content: flex-end;
  z-index: 50;
}
.task-details-drawer {
  width: min(480px, 100%);
  height: 100%;
  background: var(--color-surface, #fff);
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.task-details-drawer__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.task-details-drawer__title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}
.task-details-drawer__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.task-details-drawer__close {
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
}
.task-details-drawer__description {
  font-size: 13px;
  color: var(--color-text-secondary, #374151);
  white-space: pre-wrap;
}
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}
</style>
