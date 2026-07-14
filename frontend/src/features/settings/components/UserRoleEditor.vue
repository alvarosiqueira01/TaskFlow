<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { FieldError, Role } from '../types/settings.types';

const props = defineProps<{
  userId: string | null;
  availableRoles: Role[];
  assignedRoles: Role[];
  loading: boolean;
  loadError: string | null;
  saving: boolean;
  saveError: string | null;
  saveFieldErrors: FieldError[];
  saveSuccess: boolean;
}>();

const emit = defineEmits<{
  (e: 'save', roleIds: string[]): void;
}>();

const selection = reactive<Record<string, boolean>>({});

watch(
  () => [props.availableRoles, props.assignedRoles] as const,
  ([available, assigned]) => {
    const assignedIds = new Set(assigned.map((role) => role.id));
    for (const role of available) {
      selection[role.id] = assignedIds.has(role.id);
    }
  },
  { immediate: true, deep: true }
);

function handleToggle(roleId: string, event: Event) {
  selection[roleId] = (event.target as HTMLInputElement).checked;
}

function handleSubmit() {
  const roleIds = Object.entries(selection)
    .filter(([, checked]) => checked)
    .map(([roleId]) => roleId);
  emit('save', roleIds);
}
</script>

<template>
  <section class="user-role-editor" aria-label="Manage user roles">
    <header class="user-role-editor__header">
      <h3>Manage Roles</h3>
      <p v-if="userId" class="user-role-editor__subtitle">User: {{ userId }}</p>
    </header>

    <p v-if="!userId" class="user-role-editor__empty">
      Look up a user by ID to manage their roles.
    </p>

    <template v-else>
      <p v-if="loadError" class="user-role-editor__error" role="alert">{{ loadError }}</p>

      <form v-else @submit.prevent="handleSubmit">
        <p v-if="saveSuccess" class="user-role-editor__success" role="status">Roles updated successfully.</p>
        <p v-if="saveError" class="user-role-editor__error" role="alert">{{ saveError }}</p>

        <ul class="user-role-editor__list">
          <li v-for="role in availableRoles" :key="role.id" class="user-role-editor__item">
            <label>
              <input
                type="checkbox"
                :checked="selection[role.id]"
                :disabled="loading || saving"
                @change="handleToggle(role.id, $event)"
              />
              <span>{{ role.name }}</span>
            </label>
          </li>
        </ul>

        <div class="user-role-editor__actions">
          <button type="submit" class="user-role-editor__button" :disabled="loading || saving">
            {{ saving ? 'Saving…' : 'Save roles' }}
          </button>
        </div>
      </form>
    </template>
  </section>
</template>

<style scoped>
.user-role-editor {
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
}

.user-role-editor__header h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.user-role-editor__subtitle {
  margin: 0 0 16px;
  font-size: 12px;
  color: var(--color-text-muted, #6b7280);
  word-break: break-all;
}

.user-role-editor__empty {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted, #6b7280);
}

.user-role-editor__list {
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-role-editor__item label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text, #111827);
}

.user-role-editor__success {
  margin: 0 0 12px;
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--color-success-50, #f0fdf4);
  color: var(--color-success-700, #15803d);
  font-size: 13px;
}

.user-role-editor__error {
  margin: 0 0 12px;
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--color-danger-50, #fef2f2);
  color: var(--color-danger-700, #b91c1c);
  font-size: 13px;
}

.user-role-editor__actions {
  display: flex;
  justify-content: flex-end;
}

.user-role-editor__button {
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

.user-role-editor__button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
