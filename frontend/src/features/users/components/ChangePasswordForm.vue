<script setup lang="ts">
import { computed, reactive } from 'vue';
import type { FieldError } from '../types/user.types';

const props = defineProps<{
  saving: boolean;
  error: string | null;
  fieldErrors: FieldError[];
  success: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', payload: { currentPassword: string; newPassword: string }): void;
}>();

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

function fieldError(field: string): string | undefined {
  return props.fieldErrors.find((item) => item.field === field)?.message;
}

const mismatchError = computed(() =>
  form.newPassword.length > 0 && form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword
    ? 'Passwords do not match.'
    : null
);

function handleSubmit() {
  if (mismatchError.value) {
    return;
  }
  emit('submit', {
    currentPassword: form.currentPassword,
    newPassword: form.newPassword,
  });
  form.currentPassword = '';
  form.newPassword = '';
  form.confirmPassword = '';
}
</script>

<template>
  <form class="password-form" @submit.prevent="handleSubmit">
    <h3 class="password-form__title">Change password</h3>

    <p v-if="success" class="password-form__success" role="status">Password changed successfully.</p>
    <p v-if="error" class="password-form__error" role="alert">{{ error }}</p>

    <label class="password-form__field">
      <span>Current password</span>
      <input v-model="form.currentPassword" type="password" required :disabled="saving" autocomplete="current-password" />
      <span v-if="fieldError('currentPassword')" class="password-form__field-error">
        {{ fieldError('currentPassword') }}
      </span>
    </label>

    <label class="password-form__field">
      <span>New password</span>
      <input
        v-model="form.newPassword"
        type="password"
        minlength="8"
        required
        :disabled="saving"
        autocomplete="new-password"
      />
      <span v-if="fieldError('newPassword')" class="password-form__field-error">
        {{ fieldError('newPassword') }}
      </span>
    </label>

    <label class="password-form__field">
      <span>Confirm new password</span>
      <input
        v-model="form.confirmPassword"
        type="password"
        minlength="8"
        required
        :disabled="saving"
        autocomplete="new-password"
      />
      <span v-if="mismatchError" class="password-form__field-error">{{ mismatchError }}</span>
    </label>

    <div class="password-form__actions">
      <button type="submit" class="password-form__button" :disabled="saving || !!mismatchError">
        {{ saving ? 'Updating…' : 'Update password' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.password-form {
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.password-form__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.password-form__success {
  margin: 0;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--color-success-50, #f0fdf4);
  color: var(--color-success-700, #15803d);
  font-size: 13px;
}

.password-form__error {
  margin: 0;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--color-danger-50, #fef2f2);
  color: var(--color-danger-700, #b91c1c);
  font-size: 13px;
}

.password-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted, #6b7280);
}

.password-form__field input {
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border, #e5e7eb);
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text, #111827);
}

.password-form__field input:focus-visible {
  outline: 2px solid var(--color-primary-500, #3b82f6);
  outline-offset: 1px;
}

.password-form__field-error {
  font-size: 12px;
  color: var(--color-danger-600, #dc2626);
}

.password-form__actions {
  display: flex;
  justify-content: flex-end;
}

.password-form__button {
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  border: none;
  background: var(--color-primary-600, #2563eb);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.password-form__button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
