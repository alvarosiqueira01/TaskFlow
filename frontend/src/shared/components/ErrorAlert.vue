<script setup lang="ts">
/**
 * shared/components/ErrorAlert.vue
 *
 * Human-readable, actionable inline error display, per
 * `UI-UX-guidelines.md` section 14: show "Upload failed. Please try
 * again." rather than "HTTP 500". Feature code is responsible for
 * translating a raw `ApiError` into a friendly `message` before
 * passing it here — this component only renders it.
 */
import { AlertCircle, RotateCw } from 'lucide-vue-next';

interface Props {
  message: string;
  retryLabel?: string;
  showRetry?: boolean;
}

withDefaults(defineProps<Props>(), {
  retryLabel: 'Retry',
  showRetry: false,
});

const emit = defineEmits<{ retry: [] }>();
</script>

<template>
  <div class="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3" role="alert">
    <AlertCircle class="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
    <div class="flex-1">
      <p class="text-sm text-red-800">{{ message }}</p>
      <button
        v-if="showRetry"
        type="button"
        class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-red-700 hover:text-red-900 focus-visible:outline-none focus-visible:underline"
        @click="emit('retry')"
      >
        <RotateCw class="h-3.5 w-3.5" aria-hidden="true" />
        {{ retryLabel }}
      </button>
    </div>
  </div>
</template>
