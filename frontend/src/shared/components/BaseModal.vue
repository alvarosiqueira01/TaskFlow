<script setup lang="ts">
/**
 * shared/components/BaseModal.vue
 *
 * Generic modal dialog primitive. `ConfirmationDialog` and any
 * feature-level "Task Editor" modal (per `UI-UX-guidelines.md` section
 * 22) should compose this rather than reimplementing the
 * backdrop/teleport/escape-key behavior.
 *
 * Transition duration follows `UI-UX-guidelines.md` section 12
 * (150-250ms). Focus moves to the dialog on open, per section 26
 * (Accessibility).
 */
import { onBeforeUnmount, onMounted, watch } from 'vue';
import { X } from 'lucide-vue-next';
import type { ComponentSize } from '../types/common.types';
import { vAutofocus } from '../directives/autofocus.directive';

interface Props {
  modelValue: boolean;
  title?: string;
  /** `sm` | `md` | `lg` map to max-width breakpoints; modals never use the `lg` button-size scale semantics. */
  size?: Exclude<ComponentSize, never>;
  closeOnBackdrop?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  size: 'md',
  closeOnBackdrop: true,
});

const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

const widthClasses: Record<ComponentSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
};

function close(): void {
  emit('update:modelValue', false);
}

function handleBackdropClick(): void {
  if (props.closeOnBackdrop) close();
}

function handleEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.modelValue) close();
}

watch(
  () => props.modelValue,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  },
);

onMounted(() => document.addEventListener('keydown', handleEscape));
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      leave-active-class="transition-opacity duration-150 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
        @mousedown.self="handleBackdropClick"
      >
        <Transition
          appear
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 scale-95"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            v-autofocus
            tabindex="-1"
            role="dialog"
            aria-modal="true"
            :aria-label="title"
            class="w-full rounded-xl bg-white shadow-md focus:outline-none"
            :class="widthClasses[size]"
          >
            <div v-if="title || $slots.header" class="flex items-start justify-between border-b border-slate-100 px-6 py-4">
              <slot name="header">
                <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
              </slot>
              <button
                type="button"
                class="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Close dialog"
                @click="close"
              >
                <X class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div class="px-6 py-5">
              <slot />
            </div>

            <div v-if="$slots.footer" class="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
