<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '@/shared/components/BaseButton.vue';
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue';
import TaskMetadata from '../components/TaskMetadata.vue';
import TaskAssigneeSelector from '../components/TaskAssigneeSelector.vue';
import TaskHistoryTimeline from '../components/TaskHistoryTimeline.vue';
import { useTaskStore } from '../store/taskStore';
import type { TaskPriority, TaskStatus } from '../types/task.types';

import CommentThread from '@/features/collaboration/components/CommentThread.vue';
import { MediaAttachmentList } from '@/features/media';

const props = defineProps<{ id?: string }>();
const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();

const taskId = props.id ?? (route.params.id as string);
const task = computed(() => taskStore.tasks.find((t) => t.id === taskId) ?? null);

onMounted(async () => {
  await Promise.all([taskStore.fetchTaskDetails(taskId), taskStore.loadCategoryOptions()]);
});

async function handleStatusUpdate(status: TaskStatus) {
  await taskStore.updateTaskStatus(taskId, status);
}

async function handlePriorityUpdate(priority: TaskPriority) {
  const current = task.value;
  if (!current) return;
  await taskStore.updateTask(taskId, { ...current, priority });
}

async function handleDueDateUpdate(dueDate: string | undefined) {
  const current = task.value;
  if (!current) return;
  await taskStore.updateTask(taskId, { ...current, dueDate });
}

function goBack() {
  router.push({ name: 'tasks.list' });
}
</script>

<template>
  <div class="task-details-page">
    <BaseButton variant="neutral" @click="goBack">← Back to tasks</BaseButton>

    <LoadingSkeleton v-if="taskStore.isLoading" />

    <section v-else-if="task" class="task-details-page__content">
      <h1 class="task-details-page__title">{{ task.title }}</h1>

      <MediaAttachmentList :task-id="task.id" />

      <p v-if="task.description" class="task-details-page__description">{{ task.description }}</p>

      <TaskMetadata
        :task="task"
        :category-options="taskStore.categoryOptions"
        :is-updating="taskStore.isMutating"
        @update-status="handleStatusUpdate"
        @update-priority="handlePriorityUpdate"
        @update-due-date="handleDueDateUpdate"
      />

      <TaskAssigneeSelector :task-id="task.id" :initial-assignees="task.assignedUsers ?? []" />

      <CommentThread :task-id="task.id" />

      <TaskHistoryTimeline :task-id="task.id" />
    </section>
  </div>
</template>

<style scoped>
.task-details-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  max-width: 720px;
  margin: 0 auto;
}
.task-details-page__title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}
.task-details-page__description {
  font-size: 14px;
  color: var(--color-text-secondary, #374151);
  white-space: pre-wrap;
}
</style>
