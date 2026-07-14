<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/shared/components/BaseButton.vue';
import CategoryGrid from '../components/CategoryGrid.vue';
import CategoryEditor from '../components/CategoryEditor.vue';
import { useCategoryStore } from '../store/categoryStore';
import type { CategoryInput } from '../types/category.types';

const categoryStore = useCategoryStore();
const isEditorOpen = ref(false);

function openEditor() {
  isEditorOpen.value = true;
}

async function handleSubmit(payload: CategoryInput) {
  await categoryStore.createCategory(payload);
  isEditorOpen.value = false;
}
</script>

<template>
  <div class="category-list-page">
    <header class="category-list-page__header">
      <h1 class="category-list-page__title">Categories</h1>
      <BaseButton variant="primary" @click="openEditor">New Category</BaseButton>
    </header>

    <CategoryGrid />

    <CategoryEditor v-model="isEditorOpen" :is-submitting="categoryStore.isMutating" @submit="handleSubmit" />
  </div>
</template>

<style scoped>
.category-list-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
}
.category-list-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.category-list-page__title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}
</style>
