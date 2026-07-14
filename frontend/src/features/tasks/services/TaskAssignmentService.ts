import { httpClient } from '@/core/api/http-client';
import type { User } from '@/features/users/types/user.types';

const BASE_PATH = '/tasks';

export const TaskAssignmentService = {
  async getTaskAssignments(taskId: string): Promise<User[]> {
    const { data } = await httpClient.get<User[]>(`${BASE_PATH}/${taskId}/assignments`);
    return data;
  },

  async assignUserToTask(taskId: string, userId: string): Promise<void> {
    await httpClient.post(`${BASE_PATH}/${taskId}/assignments`, { userId });
  },

  async removeTaskAssignment(taskId: string, userId: string): Promise<void> {
    await httpClient.delete(`${BASE_PATH}/${taskId}/assignments/${userId}`);
  },
};
