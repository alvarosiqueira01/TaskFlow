<script setup lang="ts">
import type { Role } from '../types/settings.types';

defineProps<{
  roles: Role[];
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();
</script>

<template>
  <section class="roles-catalog" aria-label="Available roles">
    <header class="roles-catalog__header">
      <h3>Roles Catalog</h3>
    </header>

    <div v-if="error" class="roles-catalog__error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="$emit('retry')">Try again</button>
    </div>

    <p v-else-if="!loading && roles.length === 0" class="roles-catalog__empty">
      No roles have been defined yet.
    </p>

    <ul v-else class="roles-catalog__list">
      <template v-if="loading">
        <li v-for="n in 3" :key="`skeleton-${n}`" class="roles-catalog__item roles-catalog__item--skeleton">
          <span>&nbsp;</span>
        </li>
      </template>
      <template v-else>
        <li v-for="role in roles" :key="role.id" class="roles-catalog__item">
          <span class="roles-catalog__name">{{ role.name }}</span>
          <span v-if="role.description" class="roles-catalog__description">{{ role.description }}</span>
        </li>
      </template>
    </ul>
  </section>
</template>

<style scoped>
.roles-catalog {
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
}

.roles-catalog__header h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.roles-catalog__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.roles-catalog__item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--color-neutral-50, #f9fafb);
}

.roles-catalog__item--skeleton {
  height: 40px;
  background: var(--color-border, #e5e7eb);
}

.roles-catalog__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.roles-catalog__description {
  font-size: 12px;
  color: var(--color-text-muted, #6b7280);
}

.roles-catalog__empty {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted, #6b7280);
}

.roles-catalog__error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--color-danger-50, #fef2f2);
  color: var(--color-danger-700, #b91c1c);
}

.roles-catalog__error button {
  border: none;
  background: transparent;
  color: inherit;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
</style>
