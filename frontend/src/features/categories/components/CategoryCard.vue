<script setup lang="ts">
import CategoryProgressBar from './CategoryProgressBar.vue';
import { useCategoryStats } from '../composables/useCategoryStats';
import type { Category } from '../types/category.types';

const props = defineProps<{ category: Category }>();
const { stats } = useCategoryStats(props.category.id);
</script>

<template>
  <article class="category-card">
    <header class="category-card__header">
      <span class="category-card__dot" :style="{ backgroundColor: category.color || 'var(--color-primary, #2563eb)' }" />
      <h3 class="category-card__title">{{ category.name }}</h3>
    </header>

    <p v-if="category.description" class="category-card__description">{{ category.description }}</p>

    <p class="category-card__count">
      {{ stats.totalTasks === null ? '— tasks' : `${stats.totalTasks} task${stats.totalTasks === 1 ? '' : 's'}` }}
    </p>

    <CategoryProgressBar :percentage="stats.completionPercentage" />
  </article>
</template>

<style scoped>
.category-card {
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.category-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.category-card__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.category-card__title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}
.category-card__description {
  font-size: 12px;
  color: var(--color-text-secondary, #6b7280);
  margin: 0;
}
.category-card__count {
  font-size: 12px;
  color: var(--color-text-secondary, #6b7280);
  margin: 0;
}
</style>
