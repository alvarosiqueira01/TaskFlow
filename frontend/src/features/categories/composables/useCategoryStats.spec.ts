import { setActivePinia, createPinia } from 'pinia';
import { useCategoryStats } from './useCategoryStats';
import { useCategoryStore } from '../store/categoryStore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useCategoryStats.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('triggers store loading and exposes computed stats', async () => {
    const store = useCategoryStore();
    vi.spyOn(store, 'loadStatsFor').mockImplementation(async () => {
      store.statsByCategoryId['cat-1'] = { categoryId: 'cat-1', totalTasks: 10, completedTasks: 5, completionPercentage: 50 };
    });

    const { stats, loadStats } = useCategoryStats('cat-1', { autoLoad: false });

    // Should return fallback empty stats initially
    expect(stats.value.totalTasks).toBeNull();

    await loadStats();

    expect(store.loadStatsFor).toHaveBeenCalledWith('cat-1');
    expect(stats.value.totalTasks).toBe(10);
    expect(stats.value.completionPercentage).toBe(50);
  });
});
