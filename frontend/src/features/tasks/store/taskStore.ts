import { defineStore } from 'pinia';
import { TaskService } from '../services/TaskService';
import { TaskCategoryOptionsService } from '../services/TaskCategoryOptionsService';
import type { CategoryOption } from '../types/category-option.types';
import type {
  SortOrder,
  Task,
  TaskInput,
  TaskListParams,
  TaskPriority,
  TaskSortField,
  TaskStatus,
} from '../types/task.types';

interface TaskFiltersState {
  q: string;
  status: TaskStatus | null;
  priority: TaskPriority | null;
  categoryId: string | null;
  sortBy: TaskSortField;
  sortOrder: SortOrder;
}

interface TaskStoreState {
  tasks: Task[];
  categoryOptions: CategoryOption[];
  filters: TaskFiltersState;
  nextCursor: string | null;
  total: number | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  isMutating: boolean;
  error: string | null;
  selectedTaskId: string | null;
}

const DEFAULT_FILTERS: TaskFiltersState = {
  q: '',
  status: null,
  priority: null,
  categoryId: null,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useTaskStore = defineStore('tasks', {
  state: (): TaskStoreState => ({
    tasks: [],
    categoryOptions: [],
    filters: { ...DEFAULT_FILTERS },
    nextCursor: null,
    total: null,
    isLoading: false,
    isLoadingMore: false,
    isMutating: false,
    error: null,
    selectedTaskId: null,
  }),

  getters: {
    tasksByStatus: (state) => (status: TaskStatus) => state.tasks.filter((task) => task.status === status),
    hasMore: (state) => Boolean(state.nextCursor),
    selectedTask: (state) => state.tasks.find((task) => task.id === state.selectedTaskId) ?? null,
  },

  actions: {
    buildQueryParams(cursor?: string): TaskListParams {
      return {
        q: this.filters.q || undefined,
        status: this.filters.status ?? undefined,
        priority: this.filters.priority ?? undefined,
        categoryId: this.filters.categoryId ?? undefined,
        sortBy: this.filters.sortBy,
        sortOrder: this.filters.sortOrder,
        cursor,
        limit: 20,
      };
    },

    async loadTasks() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await TaskService.listTasks(this.buildQueryParams());
        this.tasks = response.items ?? [];
        this.nextCursor = response.nextCursor ?? null;
        this.total = response.total ?? null;
      } catch (err) {
        this.error = 'Failed to load tasks. Please try again.';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async loadMoreTasks() {
      if (!this.nextCursor || this.isLoadingMore) return;
      this.isLoadingMore = true;
      try {
        const response = await TaskService.listTasks(this.buildQueryParams(this.nextCursor));
        this.tasks = [...this.tasks, ...(response.items ?? [])];
        this.nextCursor = response.nextCursor ?? null;
      } catch (err) {
        this.error = 'Failed to load more tasks.';
        throw err;
      } finally {
        this.isLoadingMore = false;
      }
    },

    async loadCategoryOptions() {
      try {
        this.categoryOptions = await TaskCategoryOptionsService.listCategoryOptions();
      } catch {
        this.categoryOptions = [];
      }
    },

    async fetchTaskDetails(id: string): Promise<Task> {
      const task = await TaskService.getTask(id);
      const index = this.tasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.tasks.splice(index, 1, task);
      } else {
        this.tasks.push(task);
      }
      return task;
    },

    async createTask(input: TaskInput): Promise<Task> {
      this.isMutating = true;
      try {
        const idempotencyKey = crypto.randomUUID();
        const created = await TaskService.createTask(input, idempotencyKey);
        this.tasks = [created, ...this.tasks];
        return created;
      } finally {
        this.isMutating = false;
      }
    },

    async updateTask(id: string, input: TaskInput): Promise<Task> {
      this.isMutating = true;
      try {
        const updated = await TaskService.updateTask(id, input);
        const index = this.tasks.findIndex((task) => task.id === id);
        if (index !== -1) this.tasks.splice(index, 1, updated);
        return updated;
      } finally {
        this.isMutating = false;
      }
    },

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
      const current = this.tasks.find((task) => task.id === id);
      if (!current) throw new Error('Task not found in local state.');
      return this.updateTask(id, {
        title: current.title,
        description: current.description,
        categoryId: current.categoryId,
        status,
        priority: current.priority,
        visibility: current.visibility,
        dueDate: current.dueDate,
        archived: current.archived,
      });
    },

    async deleteTask(id: string): Promise<void> {
      this.isMutating = true;
      try {
        await TaskService.deleteTask(id);
        this.tasks = this.tasks.filter((task) => task.id !== id);
        if (this.selectedTaskId === id) this.selectedTaskId = null;
      } finally {
        this.isMutating = false;
      }
    },

    selectTask(id: string | null) {
      this.selectedTaskId = id;
    },

    setFilters(partial: Partial<TaskFiltersState>) {
      this.filters = { ...this.filters, ...partial };
    },

    resetFilters() {
      this.filters = { ...DEFAULT_FILTERS };
    },
  },
});
