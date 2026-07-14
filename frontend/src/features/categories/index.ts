/**
 * Public API surface of the Categories feature, for other features that
 * need read-only category data (e.g. Tasks, for select options/badges)
 * without importing internal components, store, or services directly.
 */
export * from './types/category.types';
export * from './types/category-stats.types';
export { useCategoryOptions } from './composables/useCategoryOptions';
export { useCategoryStats } from './composables/useCategoryStats';
export { useCategoryStore } from './store/categoryStore';
