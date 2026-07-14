<script setup lang="ts">
import { onMounted } from 'vue';
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import CategoryCard from './CategoryCard.vue';
import { useCategoryStore } from '../store/categoryStore';

const categoryStore = useCategoryStore();

onMounted(async () => {
  await categoryStore.loadCategories();
  await categoryStore.loadAllStats();
});
</script>

<template>
  <div class="category-grid">
    <LoadingSkeleton v-if="categoryStore.isLoading" />

    <EmptyState
      v-else-if="!categoryStore.categories.length"
      title="No categories yet"
      description="Create a category to start organizing tasks."
    />

    <div v-else class="category-grid__items">
      <CategoryCard v-for="category in categoryStore.categories" :key="category.id" :category="category" />
    </div>
  </div>
</template>

<style scoped>
.category-grid__items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
</style>
