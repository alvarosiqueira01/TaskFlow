<script setup lang="ts">
import { ref } from 'vue';
import BaseAvatar from '@/shared/components/BaseAvatar.vue';
import BaseButton from '@/shared/components/BaseButton.vue';
import BaseInput from '@/shared/components/BaseInput.vue';
import { useTaskAssignments } from '../composables/useTaskAssignments';
import type { User } from '@/features/users/types/user.types';

const props = defineProps<{ taskId: string; initialAssignees: User[] }>();

const { assignedUsers, isMutating, error, assignUser, removeAssignment } = useTaskAssignments(
  props.taskId,
  props.initialAssignees,
);

const newUserId = ref('');

async function handleAssign() {
  if (!newUserId.value.trim()) return;
  await assignUser(newUserId.value.trim());
  newUserId.value = '';
}
</script>

<template>
  <div class="task-assignee-selector">
    <h4 class="task-assignee-selector__title">Assignees</h4>

    <ul class="task-assignee-selector__list">
      <li v-for="user in assignedUsers" :key="user.id" class="task-assignee-selector__item">
        <BaseAvatar :name="user.fullName ?? user.username" :src="user.avatarUrl" size="sm" />
        <span>{{ user.fullName ?? user.username }}</span>
        <button
          type="button"
          class="task-assignee-selector__remove"
          :disabled="isMutating"
          aria-label="Remove assignee"
          @click="removeAssignment(user.id)"
        >
          ×
        </button>
      </li>
      <li v-if="!assignedUsers.length" class="task-assignee-selector__empty">No one is assigned yet.</li>
    </ul>

    <!--
      The API contract has no user directory/search endpoint, so assigning
      currently requires the exact user UUID. A "list users" endpoint would
      let this be replaced with a proper search-and-select control.
    -->
    <div class="task-assignee-selector__add">
      <BaseInput v-model="newUserId" placeholder="User ID (UUID)" aria-label="User ID to assign" />
      <BaseButton variant="secondary" :loading="isMutating" @click="handleAssign">Assign</BaseButton>
    </div>

    <p v-if="error" class="task-assignee-selector__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.task-assignee-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.task-assignee-selector__title {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
}
.task-assignee-selector__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.task-assignee-selector__item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.task-assignee-selector__remove {
  margin-left: auto;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-text-secondary, #6b7280);
}
.task-assignee-selector__empty {
  font-size: 12px;
  color: var(--color-text-secondary, #9ca3af);
}
.task-assignee-selector__add {
  display: flex;
  gap: 8px;
}
.task-assignee-selector__error {
  font-size: 12px;
  color: var(--color-error, #dc2626);
}
</style>
