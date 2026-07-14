<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import TaskFilterToolbar from '../components/TaskFilterToolbar.vue';
import KanbanBoard from '../components/KanbanBoard.vue';
import TaskEditor from '../components/TaskEditor.vue';
import TaskDetailsDrawer from '../components/TaskDetailsDrawer.vue';
import BaseButton from '@/shared/components/BaseButton.vue';
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import { useTaskStore } from '../store/taskStore';
import { useTaskSelection } from '../composables/useTaskSelection';
import type { Task, TaskInput, TaskStatus } from '../types/task.types';

const taskStore = useTaskStore();
const router = useRouter();

const viewMode = ref<'board' | 'list'>('board');
const isEditorOpen = ref(false);
const editingTask = ref<Task | null>(null);

const { selectedTask, isDrawerOpen, isLoadingDetails, openTask, closeDrawer } = useTaskSelection();

onMounted(async () => {
  await Promise.all([taskStore.loadTasks(), taskStore.loadCategoryOptions()]);
});

function toggleViewMode() {
  viewMode.value = viewMode.value === 'board' ? 'list' : 'board';
}

function openCreateEditor() {
  editingTask.value = null;
  isEditorOpen.value = true;
}

function openEditEditor(task: Task) {
  editingTask.value = task;
  isEditorOpen.value = true;
  closeDrawer();
}

async function handleEditorSubmit(payload: TaskInput) {
  if (editingTask.value) {
    await taskStore.updateTask(editingTask.value.id, payload);
  } else {
    await taskStore.createTask(payload);
  }
  isEditorOpen.value = false;
}

async function handleMoveTask(payload: { taskId: string; status: TaskStatus }) {
  await taskStore.updateTaskStatus(payload.taskId, payload.status);
}

async function handleDeleteTask(taskId: string) {
  await taskStore.deleteTask(taskId);
  closeDrawer();
}

function handleOpenTask(taskId: string) {
  openTask(taskId);
  router.replace({ name: 'tasks.details', params: { id: taskId } }).catch(() => {});
}

function handleCloseDrawer() {
  closeDrawer();
  router.replace({ name: 'tasks.list' }).catch(() => {});
}
</script>

<template>
  <div class="task-list-page">
    <header class="task-list-page__header">
      <h1 class="task-list-page__title">Tasks</h1>
    </header>

    <TaskFilterToolbar :view-mode="viewMode" @create-task="openCreateEditor" @toggle-view="toggleViewMode" />

    <LoadingSkeleton v-if="taskStore.isLoading" />

    <EmptyState v-else-if="!taskStore.tasks.length" title="No tasks found" description="Create your first task to get started.">
      <Button variant="primary" @click="openCreateEditor">New Task</Button>
    </EmptyState>

    <KanbanBoard v-else :tasks="taskStore.tasks" @open-task="handleOpenTask" @move-task="handleMoveTask" />

    <div v-if="taskStore.hasMore" class="task-list-page__load-more">
      <BaseButton variant="neutral" :loading="taskStore.isLoadingMore" @click="taskStore.loadMoreTasks">
        Load more tasks
      </BaseButton>
    </div>

    <TaskEditor
      v-model="isEditorOpen"
      :task="editingTask"
      :category-options="taskStore.categoryOptions"
      :is-submitting="taskStore.isMutating"
      @submit="handleEditorSubmit"
    />

    <TaskDetailsDrawer
      :is-open="isDrawerOpen"
      :task="selectedTask"
      :is-loading="isLoadingDetails"
      :category-options="taskStore.categoryOptions"
      @close="handleCloseDrawer"
      @edit="openEditEditor"
      @delete="handleDeleteTask"
    />
  </div>
</template>

<style scoped>
.task-list-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
}
.task-list-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.task-list-page__title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}
.task-list-page__load-more {
  display: flex;
  justify-content: center;
}
</style>
