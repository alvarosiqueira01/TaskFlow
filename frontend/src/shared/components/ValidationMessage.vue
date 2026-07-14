<script setup lang="ts">
/**
 * shared/components/ValidationMessage.vue
 *
 * Standalone error/help text renderer, used directly by `FormField`
 * and also usable on its own (e.g. below a group of `BaseCheckbox`
 * controls that don't fit the single-control `FormField` shape).
 */
import { AlertCircle } from 'lucide-vue-next';

interface Props {
  message?: string | null;
  variant?: 'error' | 'help';
}

withDefaults(defineProps<Props>(), {
  message: null,
  variant: 'error',
});
</script>

<template>
  <p
    v-if="message"
    class="mt-1.5 flex items-center gap-1 text-xs"
    :class="variant === 'error' ? 'text-red-600' : 'text-slate-500'"
    role="alert"
  >
    <AlertCircle v-if="variant === 'error'" class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    {{ message }}
  </p>
</template>
