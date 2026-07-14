<script setup lang="ts">
import { computed } from 'vue';
import Badge from '@/shared/components/Badge.vue';
import { getPriorityOption } from '../constants/task-options';
import type { TaskPriority } from '../types/task.types';

const props = defineProps<{ priority: TaskPriority }>();
const option = computed(() => getPriorityOption(props.priority));
</script>

<template>
  <Badge :variant="option.color" :icon="option.icon">{{ option.label }}</Badge>
</template>
