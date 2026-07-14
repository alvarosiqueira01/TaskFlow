import { ref } from 'vue';
import { TaskService } from '../services/TaskService';
import type { TaskHistory } from '../types/task-history.types';

export function useTaskHistory(taskId: string) {
  const history = ref<TaskHistory[]>([]);
  const nextCursor = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function loadHistory() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await TaskService.getTaskHistory(taskId, { limit: 20 });
      history.value = response.items ?? [];
      nextCursor.value = response.nextCursor ?? null;
    } catch {
      error.value = 'Failed to load task history.';
    } finally {
      isLoading.value = false;
    }
  }

  async function loadMoreHistory() {
    if (!nextCursor.value) return;
    const response = await TaskService.getTaskHistory(taskId, {
      limit: 20,
      cursor: nextCursor.value,
    });
    history.value = [...history.value, ...(response.items ?? [])];
    nextCursor.value = response.nextCursor ?? null;
  }

  return { history, isLoading, error, hasMore: nextCursor, loadHistory, loadMoreHistory };
}
