import { httpClient } from '@/core/api/http-client';
import type { CategoryOption } from '../types/category-option.types';

/**
 * Read-only lookup used exclusively to populate category selects/badges
 * within the Tasks feature. Full category CRUD is owned by the
 * `categories` feature and must not be duplicated here.
 */
export const TaskCategoryOptionsService = {
  async listCategoryOptions(): Promise<CategoryOption[]> {
    const { data } = await httpClient.get<CategoryOption[]>('/categories');
    return data;
  },
};