<script setup lang="ts">
/**
 * shared/components/ConfirmationDialog.vue
 *
 * Modal confirmation for destructive or non-trivial actions (delete
 * task, delete category, remove media attachment) — per
 * `UI-UX-guidelines.md` section 15: "Use modal dialogs only for
 * confirmations or complex workflows."
 *
 * Usage:
 *   <ConfirmationDialog
 *     v-model="isConfirmOpen"
 *     title="Delete task"
 *     message="This cannot be undone."
 *     variant="danger"
 *     :loading="isDeleting"
 *     @confirm="handleDelete"
 *   />
 */
import { AlertTriangle } from 'lucide-vue-next';
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';
import type { ComponentVariant } from '../types/common.types';

interface Props {
  modelValue: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Extract<ComponentVariant, 'danger' | 'primary' | 'warning'>;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  variant: 'danger',
  loading: false,
});

const emit = defineEmits<{ 'update:modelValue': [boolean]; confirm: []; cancel: [] }>();

function handleCancel(): void {
  emit('cancel');
  emit('update:modelValue', false);
}

function handleConfirm(): void {
  emit('confirm');
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="title"
    size="sm"
    :close-on-backdrop="!loading"
    @update:model-value="(value) => !loading && emit('update:modelValue', value)"
  >
    <div class="flex gap-3">
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        :class="variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'"
      >
        <AlertTriangle class="h-5 w-5" aria-hidden="true" />
      </span>
      <p class="pt-2 text-sm text-slate-600">{{ message }}</p>
    </div>

    <template #footer>
      <BaseButton variant="secondary" :disabled="loading" @click="handleCancel">
        {{ cancelLabel }}
      </BaseButton>
      <BaseButton :variant="variant" :loading="loading" @click="handleConfirm">
        {{ confirmLabel }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
