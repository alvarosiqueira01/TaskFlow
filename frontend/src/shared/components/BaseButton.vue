<script setup lang="ts">
/**
 * shared/components/BaseButton.vue
 *
 * The single button primitive used everywhere in the application
 * ("New Task", "Save changes", "Export CSV", dialog actions, ...).
 * Implements the interactive states required by
 * `UI-UX-guidelines.md` section 31: hover, focus, active, loading,
 * and disabled.
 */
import { computed } from 'vue';
import { Loader2 } from 'lucide-vue-next';
import type { ComponentSize, ComponentVariant } from '../types/common.types';

interface Props {
  variant?: ComponentVariant;
  size?: ComponentSize;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  /** Expands the button to fill its container's width. */
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
});

const emit = defineEmits<{ click: [MouseEvent] }>();

const isDisabled = computed(() => props.disabled || props.loading);

const variantClasses: Record<ComponentVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500 disabled:bg-blue-300',
  secondary:
    'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-400 disabled:text-slate-400',
  success:
    'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus-visible:ring-green-500 disabled:bg-green-300',
  warning:
    'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 focus-visible:ring-orange-400 disabled:bg-orange-300',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500 disabled:bg-red-300',
  neutral:
    'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400 disabled:text-slate-400',
};

const sizeClasses: Record<ComponentSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

function handleClick(event: MouseEvent): void {
  if (isDisabled.value) return;
  emit('click', event);
}
</script>

<template>
  <button
    :type="type"
    :disabled="isDisabled"
    :aria-busy="loading"
    class="inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed"
    :class="[variantClasses[variant], sizeClasses[size], block ? 'w-full' : '']"
    @click="handleClick"
  >
    <Loader2 v-if="loading" class="h-4 w-4 animate-spin" aria-hidden="true" />
    <slot v-else name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </button>
</template>
