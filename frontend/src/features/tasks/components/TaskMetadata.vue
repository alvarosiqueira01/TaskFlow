<script setup lang="ts">
import { computed } from 'vue';
import BaseSelect from '@/shared/components/BaseSelect.vue';
import BaseDatePicker from '@/shared/components/BaseDatePicker.vue';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from '../constants/task-options';
import { formatDateTime } from '@/shared/utils/date.util';
import type { CategoryOption } from '../types/category-option.types';
import type { Task, TaskPriority, TaskStatus } from '../types/task.types';

const props = defineProps<{
  task: Task;
  categoryOptions: CategoryOption[];
  isUpdating: boolean;
}>();

const emit = defineEmits<{
  (e: 'update-status', status: TaskStatus): void;
  (e: 'update-priority', priority: TaskPriority): void;
  (e: 'update-due-date', dueDate: string | undefined): void;
}>();

const categoryName = computed(() => {
  const category = props.categoryOptions.find((c) => c.id === props.task.categoryId);
  return category?.name ?? 'Uncategorized';
});
</script>

<template>
  <dl class="task-metadata">
    <div class="task-metadata__row">
      <dt>Status</dt>
      <dd>
        <BaseSelect
          :model-value="task.status"
          :options="TASK_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))"
          :disabled="isUpdating"
          @update:model-value="(value: string) => emit('update-status', value as TaskStatus)"
        />
      </dd>
    </div>

    <div class="task-metadata__row">
      <dt>Priority</dt>
      <dd>
        <BaseSelect
          :model-value="task.priority"
          :options="TASK_PRIORITY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))"
          :disabled="isUpdating"
          @update:model-value="(value: string) => emit('update-priority', value as TaskPriority)"
        />
      </dd>
    </div>

    <div class="task-metadata__row">
      <dt>Category</dt>
      <dd>{{ categoryName }}</dd>
    </div>

    <div class="task-metadata__row">
      <dt>Due date</dt>
      <dd>
        <BaseDatePicker
          :model-value="task.dueDate ?? null"
          :disabled="isUpdating"
          @update:model-value="(value: string | null) => emit('update-due-date', value ?? undefined)"
        />
      </dd>
    </div>

    <div class="task-metadata__row">
      <dt>Created</dt>
      <dd>{{ formatDateTime(task.createdAt) }}</dd>
    </div>

    <div class="task-metadata__row">
      <dt>Last updated</dt>
      <dd>{{ formatDateTime(task.updatedAt) }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.task-metadata {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
}
.task-metadata__row {
  display: grid;
  grid-template-columns: 96px 1fr;
  align-items: center;
  gap: 12px;
}
.task-metadata__row dt {
  font-size: 12px;
  color: var(--color-text-secondary, #6b7280);
}
.task-metadata__row dd {
  margin: 0;
  font-size: 13px;
}
</style>
