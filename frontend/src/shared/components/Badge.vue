<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    variant: 'primary',
    size: 'md',
  }
);

const styleClasses = computed(() => {
  const variants = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-800',
    outline: 'border border-gray-300 text-gray-700 bg-transparent',
    danger: 'bg-red-500 text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return [
    'inline-flex items-center font-medium rounded-full',
    variants[props.variant],
    sizes[props.size],
  ];
});
</script>

<template>
  <span :class="styleClasses">
    <slot />
  </span>
</template>
