<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import BaseModal from '@/shared/components/BaseModal.vue';
import BaseButton from '@/shared/components/BaseButton.vue';
import BaseInput from '@/shared/components/BaseInput.vue';
import BaseTextarea from '@/shared/components/BaseTextarea.vue';
import BaseSelect from '@/shared/components/BaseSelect.vue';
import BaseDatePicker from '@/shared/components/BaseDatePicker.vue';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS, TASK_VISIBILITY_OPTIONS } from '../constants/task-options';
import type { CategoryOption } from '../types/category-option.types';
import type { Task, TaskInput } from '../types/task.types';

const props = defineProps<{
  modelValue: boolean;
  task?: Task | null;
  categoryOptions: CategoryOption[];
  isSubmitting: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', payload: TaskInput): void;
}>();

const form = reactive<TaskInput>({
  title: '',
  description: '',
  categoryId: undefined,
  status: 'BACKLOG',
  priority: 'MEDIUM',
  visibility: 'PRIVATE',
  dueDate: undefined,
  archived: false,
});

const errors = reactive<{ title?: string }>({});
const isEditMode = computed(() => Boolean(props.task));

watch(
  () => props.task,
  (task) => {
    form.title = task?.title ?? '';
    form.description = task?.description ?? '';
    form.categoryId = task?.categoryId ?? undefined;
    form.status = task?.status ?? 'BACKLOG';
    form.priority = task?.priority ?? 'MEDIUM';
    form.visibility = task?.visibility ?? 'PRIVATE';
    form.dueDate = task?.dueDate ?? undefined;
    form.archived = task?.archived ?? false;
  },
  { immediate: true },
);

const categorySelectOptions = computed(() => [
  { value: '', label: 'No category' },
  ...props.categoryOptions.map((c) => ({ value: c.id, label: c.name })),
]);

function close() {
  emit('update:modelValue', false);
}

function handleSubmit() {
  errors.title = form.title.trim() ? undefined : 'Title is required.';
  if (errors.title) return;

  emit('submit', {
    title: form.title.trim(),
    description: form.description || undefined,
    categoryId: form.categoryId || undefined,
    status: form.status,
    priority: form.priority,
    visibility: form.visibility,
    dueDate: form.dueDate || undefined,
    archived: form.archived,
  });
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEditMode ? 'Edit Task' : 'New Task'"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <form class="task-editor" @submit.prevent="handleSubmit">
      <BaseInput v-model="form.title" label="Title" placeholder="Task title" :error="errors.title" required maxlength="200" />

      <BaseTextarea v-model="form.description" label="Description" placeholder="Describe the task..." :rows="4" />

      <div class="task-editor__row">
        <BaseSelect v-model="form.status" label="Status" :options="TASK_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))" />
        <BaseSelect v-model="form.priority" label="Priority" :options="TASK_PRIORITY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))" />
      </div>

      <div class="task-editor__row">
        <BaseSelect v-model="form.categoryId" label="Category" :options="categorySelectOptions" />
        <BaseSelect v-model="form.visibility" label="Visibility" :options="TASK_VISIBILITY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))" />
      </div>

      <BaseDatePicker v-model="form.dueDate" label="Due date" />

      <footer class="task-editor__actions">
        <BaseButton type="button" variant="neutral" @click="close">Cancel</BaseButton>
        <BaseButton type="submit" variant="primary" :loading="isSubmitting">
          {{ isEditMode ? 'Save changes' : 'Create task' }}
        </BaseButton>
      </footer>
    </form>
  </BaseModal>
</template>

<style scoped>
.task-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.task-editor__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.task-editor__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}
</style>
