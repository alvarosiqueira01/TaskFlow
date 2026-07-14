<script setup lang="ts">
import BaseInput from '@/shared/components/BaseInput.vue';
import BaseSelect from '@/shared/components/BaseSelect.vue';
import BaseButton from '@/shared/components/BaseButton.vue';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from '../constants/task-options';
import { useTaskFilters } from '../composables/useTaskFilters';
import type { TaskPriority, TaskStatus } from '../types/task.types';

defineProps<{ viewMode: 'board' | 'list' }>();
const emit = defineEmits<{ (e: 'create-task'): void; (e: 'toggle-view'): void }>();

const { searchInput, filters, setStatus, setPriority, clearFilters } = useTaskFilters();

const statusSelectOptions = [
  { value: '', label: 'All statuses' },
  ...TASK_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
];
const prioritySelectOptions = [
  { value: '', label: 'All priorities' },
  ...TASK_PRIORITY_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
];

function handleStatusChange(value: string) {
  setStatus(value ? (value as TaskStatus) : null);
}

function handlePriorityChange(value: string) {
  setPriority(value ? (value as TaskPriority) : null);
}
</script>

<template>
  <div class="task-filter-toolbar">
    <BaseInput
      v-model="searchInput"
      type="search"
      placeholder="Search tasks..."
      aria-label="Search tasks"
      class="task-filter-toolbar__search"
    />

    <BaseSelect
      :model-value="filters.status ?? ''"
      :options="statusSelectOptions"
      aria-label="Filter by status"
      @update:model-value="handleStatusChange"
    />

    <BaseSelect
      :model-value="filters.priority ?? ''"
      :options="prioritySelectOptions"
      aria-label="Filter by priority"
      @update:model-value="handlePriorityChange"
    />

    <BaseButton variant="neutral" @click="clearFilters">Clear</BaseButton>
    <BaseButton variant="secondary" @click="emit('toggle-view')">
      {{ viewMode === 'board' ? 'List view' : 'Board view' }}
    </BaseButton>
    <BaseButton variant="primary" @click="emit('create-task')">New Task</BaseButton>
  </div>
</template>

<style scoped>
.task-filter-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.task-filter-toolbar__search {
  flex: 1;
  min-width: 220px;
}
</style>
