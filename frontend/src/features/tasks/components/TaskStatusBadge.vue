<script setup lang="ts">
import { computed } from 'vue';
import Badge from '@/shared/components/Badge.vue';
import { getStatusOption } from '../constants/task-options';
import type { TaskStatus } from '../types/task.types';

const props = defineProps<{ status: TaskStatus }>();
const option = computed(() => getStatusOption(props.status));
</script>

<template>
  <Badge :variant="option.color">{{ option.label }}</Badge>
</template>
