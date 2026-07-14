<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'lookup', userId: string): void;
}>();

const userIdInput = ref('');

function handleSubmit() {
  if (userIdInput.value.trim()) {
    emit('lookup', userIdInput.value.trim());
  }
}
</script>

<template>
  <form class="user-lookup" @submit.prevent="handleSubmit">
    <label class="user-lookup__field">
      <span>User ID</span>
      <input v-model="userIdInput" type="text" placeholder="Paste a user UUID" required />
    </label>
    <button type="submit" class="user-lookup__button">Look up roles</button>
    <p class="user-lookup__hint">
      There is no user directory in the API yet, so roles are managed by user ID.
    </p>
  </form>
</template>

<style scoped>
.user-lookup {
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-lookup__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted, #6b7280);
}

.user-lookup__field input {
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border, #e5e7eb);
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text, #111827);
}

.user-lookup__field input:focus-visible {
  outline: 2px solid var(--color-primary-500, #3b82f6);
  outline-offset: 1px;
}

.user-lookup__button {
  align-self: flex-start;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  border: none;
  background: var(--color-primary-600, #2563eb);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.user-lookup__hint {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted, #6b7280);
}
</style>
