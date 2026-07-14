<script setup lang="ts">
import { reactive } from 'vue';
import BaseModal from '@/shared/components/BaseModal.vue';
import BaseButton from '@/shared/components/BaseButton.vue';
import BaseInput from '@/shared/components/BaseInput.vue';
import BaseTextarea from '@/shared/components/BaseTextarea.vue';
import type { CategoryInput } from '../types/category.types';

/**
 * Create-only by design: the API contract has no update or delete
 * endpoint for categories (only GET /categories and POST /categories).
 * Once those endpoints exist, this component is the natural place to
 * add editing without changing how it's consumed.
 */
const props = defineProps<{ modelValue: boolean; isSubmitting: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', payload: CategoryInput): void;
}>();

type CategoryForm = {
  name: string;
  description: string;
  color: string;
};

const form = reactive<CategoryForm>({ name: '', description: '', color: '#2563eb' });
const errors = reactive<{ name?: string }>({});

function close() {
  emit('update:modelValue', false);
}

function resetForm() {
  form.name = '';
  form.description = '';
  form.color = '#2563eb';
  errors.name = undefined;
}

function handleSubmit() {
  errors.name = form.name.trim() ? undefined : 'Name is required.';
  if (errors.name) return;

  emit('submit', {
    name: form.name.trim(),
    description: form.description || undefined,
    color: form.color || undefined,
  });
  resetForm();
}
</script>

<template>
  <BaseModal :model-value="modelValue" title="New Category" @update:model-value="emit('update:modelValue', $event)">
    <form class="category-editor" @submit.prevent="handleSubmit">
      <BaseInput v-model="form.name" label="Name" placeholder="e.g. Engineering" :error="errors.name" required maxlength="100" />

      <BaseTextarea
        v-model="form.description"
        label="Description"
        placeholder="What is this category for?"
        :rows="3"
        :maxlength="255"
      />

      <label class="category-editor__color">
        <span>Color</span>
        <input v-model="form.color" type="color" aria-label="Category color" />
      </label>

      <p class="category-editor__note">
        Editing and deleting categories isn't supported by the API yet — categories can only be created for now.
      </p>

      <footer class="category-editor__actions">
        <BaseButton type="button" variant="primary" @click="close">Cancel</BaseButton>
        <BaseButton type="submit" variant="primary" :loading="isSubmitting">Create category</BaseButton>
      </footer>
    </form>
  </BaseModal>
</template>

<style scoped>
.category-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.category-editor__color {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--color-text-secondary, #374151);
}
.category-editor__note {
  font-size: 12px;
  color: var(--color-text-secondary, #9ca3af);
  margin: 0;
}
.category-editor__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
