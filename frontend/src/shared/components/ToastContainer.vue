<script setup lang="ts">
/**
 * shared/components/ToastContainer.vue
 *
 * Visual host for the toast notification system defined in
 * `core/plugins/toast.plugin.ts`. Mount this ONCE, near the root of
 * the application (e.g. in the future root `App.vue`), so every
 * `useToast().success(...)` call anywhere in the app renders here.
 *
 * Position/stacking/transition follow `UI-UX-guidelines.md` section
 * 12 (150-250ms) and section 15 (toast notifications for task
 * created/updated, upload complete, assignment successful).
 */
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-vue-next';
import { useToast, type ToastVariant } from '../../core/plugins/toast.plugin';

const toast = useToast();

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: 'border-green-200 bg-green-50 text-green-800' },
  error: { icon: XCircle, classes: 'border-red-200 bg-red-50 text-red-800' },
  warning: { icon: AlertTriangle, classes: 'border-orange-200 bg-orange-50 text-orange-800' },
  info: { icon: Info, classes: 'border-blue-200 bg-blue-50 text-blue-800' },
};
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      <TransitionGroup
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="opacity-0 translate-y-2"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-for="message in toast.messages"
          :key="message.id"
          class="pointer-events-auto flex items-start gap-2 rounded-lg border px-4 py-3 text-sm shadow-md"
          :class="variantConfig[message.variant].classes"
          role="status"
        >
          <component :is="variantConfig[message.variant].icon" class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p class="flex-1">{{ message.text }}</p>
          <button
            type="button"
            class="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            aria-label="Dismiss notification"
            @click="toast.dismiss(message.id)"
          >
            <X class="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
