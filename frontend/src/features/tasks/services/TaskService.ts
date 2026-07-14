import { httpClient } from '@/core/api/http-client';
import type { CursorPaginationResponse } from '@/shared/types/pagination.types';
import type { Task, TaskInput, TaskListParams } from '../types/task.types';
import type { TaskHistory } from '../types/task-history.types';

const BASE_PATH = '/tasks';

export const TaskService = {
  async listTasks(params: TaskListParams = {}): Promise<CursorPaginationResponse<Task>> {
    const { data } = await httpClient.get<CursorPaginationResponse<Task>>(BASE_PATH, { params });
    return data;
  },

  async getTask(id: string): Promise<Task> {
    const { data } = await httpClient.get<Task>(`${BASE_PATH}/${id}`);
    return data;
  },

  async createTask(input: TaskInput, idempotencyKey?: string): Promise<Task> {
    const { data } = await httpClient.post<Task>(BASE_PATH, input, {
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
    });
    return data;
  },

  async updateTask(id: string, input: TaskInput): Promise<Task> {
    const { data } = await httpClient.put<Task>(`${BASE_PATH}/${id}`, input);
    return data;
  },

  async deleteTask(id: string): Promise<void> {
    await httpClient.delete(`${BASE_PATH}/${id}`);
  },

  async getTaskHistory(
    id: string,
    params: { limit?: number; cursor?: string } = {},
  ): Promise<CursorPaginationResponse<TaskHistory>> {
    const { data } = await httpClient.get<CursorPaginationResponse<TaskHistory>>(
      `${BASE_PATH}/${id}/history`,
      { params },
    );
    return data;
  },
};
