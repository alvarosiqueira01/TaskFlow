import { httpClient } from '@/core/api/http-client';
import type { Category, CategoryInput } from '../types/category.types';

const BASE_PATH = '/categories';

/**
 * The API contract exposes only list and create for categories
 * (no PUT/PATCH/DELETE). Update and delete are intentionally not
 * implemented here — adding them would mean inventing endpoints
 * outside the contract.
 */
export const CategoryService = {
  async listCategories(): Promise<Category[]> {
    const { data } = await httpClient.get<Category[]>(BASE_PATH);
    return data;
  },

  async createCategory(input: CategoryInput): Promise<Category> {
    const { data } = await httpClient.post<Category>(BASE_PATH, input);
    return data;
  },
};
