import { computed, onMounted } from 'vue';
import { useCategoryStore } from '../store/categoryStore';

export function useCategoryStats(categoryId: string, options: { autoLoad?: boolean } = {}) {
  const store = useCategoryStore();
  const stats = computed(() => store.statsFor(categoryId));

  async function loadStats() {
    await store.loadStatsFor(categoryId);
  }

  if (options.autoLoad !== false) {
    onMounted(loadStats);
  }

  return { stats, loadStats };
}
