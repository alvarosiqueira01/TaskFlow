<script setup lang="ts">
import { computed } from 'vue';
import type { CategoryDistributionItem } from '../types/report.types';

const props = defineProps<{
  items: CategoryDistributionItem[];
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();

const maxCount = computed(() => Math.max(1, ...props.items.map((item) => item.count)));
</script>

<template>
  <section class="category-distribution" aria-label="Tasks by category">
    <header class="category-distribution__header">
      <h3>By Category</h3>
    </header>

    <div v-if="error" class="category-distribution__error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="$emit('retry')">Try again</button>
    </div>

    <p v-else-if="!loading && items.length === 0" class="category-distribution__empty">
      No categories have been created yet.
    </p>

    <ul v-else class="category-distribution__list">
      <template v-if="loading">
        <li
          v-for="n in 3"
          :key="`skeleton-${n}`"
          class="category-distribution__row category-distribution__row--skeleton"
        >
          <span>&nbsp;</span>
        </li>
      </template>
      <template v-else>
        <li v-for="item in items" :key="item.categoryId" class="category-distribution__row">
          <span class="category-distribution__label">{{ item.categoryName }}</span>
          <div
            class="category-distribution__track"
            role="progressbar"
            :aria-valuenow="item.count"
            aria-valuemin="0"
            :aria-valuemax="maxCount"
            :aria-label="`${item.categoryName}: ${item.count} tasks`"
          >
            <div
              class="category-distribution__bar"
              :style="{ width: `${Math.max(4, (item.count / maxCount) * 100)}%` }"
            />
          </div>
          <span class="category-distribution__count">{{ item.count }}</span>
        </li>
      </template>
    </ul>
  </section>
</template>

<style scoped>
.category-distribution {
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
}

.category-distribution__header h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.category-distribution__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-distribution__row {
  display: grid;
  grid-template-columns: 120px 1fr 32px;
  align-items: center;
  gap: 12px;
}

.category-distribution__row--skeleton {
  height: 20px;
  background: var(--color-border, #e5e7eb);
  border-radius: 4px;
}

.category-distribution__label {
  font-size: 13px;
  color: var(--color-text-muted, #6b7280);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-distribution__track {
  height: 10px;
  border-radius: 999px;
  background: var(--color-border, #e5e7eb);
  overflow: hidden;
}

.category-distribution__bar {
  height: 100%;
  border-radius: 999px;
  background: var(--color-primary-500, #3b82f6);
  transition: width 0.3s ease;
}

.category-distribution__count {
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.category-distribution__empty {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted, #6b7280);
}

.category-distribution__error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--color-danger-50, #fef2f2);
  color: var(--color-danger-700, #b91c1c);
}

.category-distribution__error button {
  border: none;
  background: transparent;
  color: inherit;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
</style>
