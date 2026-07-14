import { httpClient } from '@/core/api/http-client';

interface TasksListResponseShape {
  total?: number;
}

/**
 * There is no dedicated category-stats endpoint in the contract. Counts
 * are derived from the existing GET /tasks list, using its categoryId
 * and status filters and reading only the optional `total` field of the
 * cursor-paginated response (limit=1 keeps the payload minimal since
 * only the count is needed, not the items).
 */
export const CategoryStatsService = {
  async getTaskCount(categoryId: string, status?: 'COMPLETED'): Promise<number | null> {
    const { data } = await httpClient.get<TasksListResponseShape>('/tasks', {
      params: { categoryId, status, limit: 1 },
    });
    return typeof data.total === 'number' ? data.total : null;
  },
};
