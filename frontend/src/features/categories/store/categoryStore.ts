import { defineStore } from 'pinia';
import { CategoryService } from '../services/CategoryService';
import { CategoryStatsService } from '../services/CategoryStatsService';
import type { CategoryStats } from '../types/category-stats.types';
import type { Category, CategoryInput } from '../types/category.types';

interface CategoryStoreState {
  categories: Category[];
  statsByCategoryId: Record<string, CategoryStats>;
  isLoading: boolean;
  isLoadingStats: boolean;
  isMutating: boolean;
  error: string | null;
}

function emptyStats(categoryId: string): CategoryStats {
  return { categoryId, totalTasks: null, completedTasks: null, completionPercentage: null };
}

export const useCategoryStore = defineStore('categories', {
  state: (): CategoryStoreState => ({
    categories: [],
    statsByCategoryId: {},
    isLoading: false,
    isLoadingStats: false,
    isMutating: false,
    error: null,
  }),

  getters: {
    statsFor: (state) => (categoryId: string) => state.statsByCategoryId[categoryId] ?? emptyStats(categoryId),
  },

  actions: {
    async loadCategories() {
      this.isLoading = true;
      this.error = null;
      try {
        this.categories = await CategoryService.listCategories();
      } catch (err) {
        this.error = 'Failed to load categories. Please try again.';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async loadStatsFor(categoryId: string) {
      try {
        const [totalTasks, completedTasks] = await Promise.all([
          CategoryStatsService.getTaskCount(categoryId),
          CategoryStatsService.getTaskCount(categoryId, 'COMPLETED'),
        ]);

        const completionPercentage =
          totalTasks && totalTasks > 0 && completedTasks !== null
            ? Math.round((completedTasks / totalTasks) * 100)
            : null;

        this.statsByCategoryId[categoryId] = {
          categoryId,
          totalTasks,
          completedTasks,
          completionPercentage,
        };
      } catch {
        this.statsByCategoryId[categoryId] = emptyStats(categoryId);
      }
    },

    async loadAllStats() {
      this.isLoadingStats = true;
      try {
        await Promise.all(this.categories.map((category) => this.loadStatsFor(category.id)));
      } finally {
        this.isLoadingStats = false;
      }
    },

    async createCategory(input: CategoryInput): Promise<Category> {
      this.isMutating = true;
      this.error = null;
      try {
        const created = await CategoryService.createCategory(input);
        this.categories = [...this.categories, created];
        this.statsByCategoryId[created.id] = emptyStats(created.id);
        return created;
      } catch (err) {
        this.error = 'Failed to create category.';
        throw err;
      } finally {
        this.isMutating = false;
      }
    },
  },
});
