import { ref } from 'vue';
import { TaskAssignmentService } from '../services/TaskAssignmentService';
import type { User } from '@/features/users/types/user.types';

export function useTaskAssignments(taskId: string, initialAssignees: User[] = []) {
  const assignedUsers = ref<User[]>(initialAssignees);
  const isLoading = ref(false);
  const isMutating = ref(false);
  const error = ref<string | null>(null);

  async function loadAssignments() {
    isLoading.value = true;
    error.value = null;
    try {
      assignedUsers.value = await TaskAssignmentService.getTaskAssignments(taskId);
    } catch {
      error.value = 'Failed to load assigned users.';
    } finally {
      isLoading.value = false;
    }
  }

  async function assignUser(userId: string) {
    isMutating.value = true;
    error.value = null;
    try {
      await TaskAssignmentService.assignUserToTask(taskId, userId);
      await loadAssignments();
    } catch {
      error.value = 'Failed to assign user. They may already be assigned.';
    } finally {
      isMutating.value = false;
    }
  }

  async function removeAssignment(userId: string) {
    isMutating.value = true;
    error.value = null;
    try {
      await TaskAssignmentService.removeTaskAssignment(taskId, userId);
      assignedUsers.value = assignedUsers.value.filter((user) => user.id !== userId);
    } catch {
      error.value = 'Failed to remove assignment.';
    } finally {
      isMutating.value = false;
    }
  }

  return { assignedUsers, isLoading, isMutating, error, loadAssignments, assignUser, removeAssignment };
}
