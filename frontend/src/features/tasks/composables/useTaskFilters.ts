import { ref, watch } from 'vue';
import { useDebounce } from '@/shared/composables/useDebounce';
import { useTaskStore } from '../store/taskStore';
import type { TaskPriority, TaskSortField, SortOrder, TaskStatus } from '../types/task.types';

export function useTaskFilters() {
  const taskStore = useTaskStore();
  const searchInput = ref(taskStore.filters.q);
  const debouncedSearch = useDebounce(searchInput, 400);

  watch(debouncedSearch, (value) => {
    taskStore.setFilters({ q: value });
    taskStore.loadTasks();
  });

  function setStatus(status: TaskStatus | null) {
    taskStore.setFilters({ status });
    taskStore.loadTasks();
  }

  function setPriority(priority: TaskPriority | null) {
    taskStore.setFilters({ priority });
    taskStore.loadTasks();
  }

  function setCategory(categoryId: string | null) {
    taskStore.setFilters({ categoryId });
    taskStore.loadTasks();
  }

  function setSort(sortBy: TaskSortField, sortOrder: SortOrder) {
    taskStore.setFilters({ sortBy, sortOrder });
    taskStore.loadTasks();
  }

  function clearFilters() {
    searchInput.value = '';
    taskStore.resetFilters();
    taskStore.loadTasks();
  }

  return {
    filters: taskStore.filters,
    searchInput,
    setStatus,
    setPriority,
    setCategory,
    setSort,
    clearFilters,
  };
}
