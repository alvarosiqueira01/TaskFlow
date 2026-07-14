import { computed, onMounted } from 'vue';
import { useCategoryStore } from '../store/categoryStore';

/**
 * Lightweight read composable for other features to consume categories
 * as select/badge options without depending on this feature's internal
 * components or pages. Import via '@/features/categories'.
 */
export function useCategoryOptions(options: { autoLoad?: boolean } = {}) {
  const store = useCategoryStore();

  const categoryOptions = computed(() =>
    store.categories.map((category) => ({ id: category.id, name: category.name, color: category.color })),
  );

  async function loadCategoryOptions() {
    await store.loadCategories();
  }

  if (options.autoLoad !== false) {
    onMounted(() => {
      if (!store.categories.length) loadCategoryOptions();
    });
  }

  return {
    categoryOptions,
    isLoading: computed(() => store.isLoading),
    loadCategoryOptions,
  };
}
