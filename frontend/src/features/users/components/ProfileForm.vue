<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { FieldError, User } from '../types/user.types';

const props = defineProps<{
  user: User | null;
  saving: boolean;
  error: string | null;
  fieldErrors: FieldError[];
}>();

const emit = defineEmits<{
  (e: 'save', payload: { fullName?: string; avatarUrl?: string }): void;
}>();

const form = reactive({
  fullName: '',
  avatarUrl: '',
});

watch(
  () => props.user,
  (user) => {
    form.fullName = user?.fullName ?? '';
    form.avatarUrl = user?.avatarUrl ?? '';
  },
  { immediate: true }
);

function fieldError(field: string): string | undefined {
  return props.fieldErrors.find((item) => item.field === field)?.message;
}

function handleCancel() {
  form.fullName = props.user?.fullName ?? '';
  form.avatarUrl = props.user?.avatarUrl ?? '';
}

function handleSubmit() {
  emit('save', {
    fullName: form.fullName,
    avatarUrl: form.avatarUrl,
  });
}
</script>

<template>
  <form class="profile-form" @submit.prevent="handleSubmit">
    <h3 class="profile-form__title">Profile details</h3>

    <p v-if="error" class="profile-form__error" role="alert">{{ error }}</p>

    <div class="profile-form__grid">
      <label class="profile-form__field">
        <span>Full name</span>
        <input v-model="form.fullName" type="text" maxlength="150" :disabled="saving" />
        <span v-if="fieldError('fullName')" class="profile-form__field-error">{{ fieldError('fullName') }}</span>
      </label>

      <label class="profile-form__field">
        <span>Avatar URL</span>
        <input v-model="form.avatarUrl" type="url" :disabled="saving" placeholder="https://…" />
        <span v-if="fieldError('avatarUrl')" class="profile-form__field-error">{{ fieldError('avatarUrl') }}</span>
      </label>

      <!--
        Username, email, and roles are read-only in this form: the
        contract's PATCH /users/me only accepts fullName and avatarUrl.
      -->
      <label class="profile-form__field profile-form__field--readonly">
        <span>Display name</span>
        <input :value="user?.username" type="text" disabled readonly />
      </label>

      <label class="profile-form__field profile-form__field--readonly">
        <span>Email</span>
        <input :value="user?.email" type="email" disabled readonly />
      </label>

      <label class="profile-form__field profile-form__field--readonly profile-form__field--span">
        <span>Role</span>
        <input :value="user?.roles?.map((role) => role.name).join(', ') || '—'" type="text" disabled readonly />
      </label>
    </div>

    <div class="profile-form__actions">
      <button
        type="button"
        class="profile-form__button profile-form__button--secondary"
        :disabled="saving"
        @click="handleCancel"
      >
        Cancel
      </button>
      <button type="submit" class="profile-form__button profile-form__button--primary" :disabled="saving">
        {{ saving ? 'Saving…' : 'Save changes' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.profile-form {
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
}

.profile-form__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.profile-form__error {
  margin: 0 0 16px;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--color-danger-50, #fef2f2);
  color: var(--color-danger-700, #b91c1c);
  font-size: 13px;
}

.profile-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.profile-form__field--span {
  grid-column: 1 / -1;
}

.profile-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted, #6b7280);
}

.profile-form__field input {
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border, #e5e7eb);
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text, #111827);
  background: var(--color-surface, #ffffff);
}

.profile-form__field input:focus-visible {
  outline: 2px solid var(--color-primary-500, #3b82f6);
  outline-offset: 1px;
}

.profile-form__field--readonly input {
  background: var(--color-neutral-50, #f9fafb);
  color: var(--color-text-muted, #6b7280);
  cursor: not-allowed;
}

.profile-form__field-error {
  font-size: 12px;
  color: var(--color-danger-600, #dc2626);
}

.profile-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.profile-form__button {
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.profile-form__button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.profile-form__button--primary {
  background: var(--color-primary-600, #2563eb);
  color: #ffffff;
}

.profile-form__button--secondary {
  background: var(--color-neutral-100, #f3f4f6);
  color: var(--color-text, #111827);
}
</style>
