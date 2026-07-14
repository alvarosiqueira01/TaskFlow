<script setup lang="ts">
/**
 * shared/components/BaseCheckbox.vue
 *
 * Checkbox control. Doubles as the visual base for the Profile
 * screen's preference switches
 * (`taskflow-screens-visual-description.md` section 7: "Email
 * notifications", "Play attachments inline", "Reduce motion") when
 * rendered in `variant="switch"`, and for future bulk-selection table
 * rows in `variant="checkbox"`.
 */
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
  variant?: 'checkbox' | 'switch';
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  description: undefined,
  disabled: false,
  id: undefined,
  variant: 'checkbox',
});

const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

const isChecked = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});
</script>

<template>
  <label class="flex cursor-pointer items-start gap-3" :class="disabled ? 'cursor-not-allowed opacity-60' : ''">
    <input
      :id="id"
      v-model="isChecked"
      type="checkbox"
      :disabled="disabled"
      class="sr-only"
    />

    <span
      v-if="variant === 'switch'"
      class="mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200"
      :class="isChecked ? 'bg-blue-600' : 'bg-slate-300'"
    >
      <span
        class="h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
        :class="isChecked ? 'translate-x-5' : 'translate-x-0'"
      />
    </span>

    <span
      v-else
      class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors duration-200"
      :class="isChecked ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'"
    >
      <svg v-if="isChecked" class="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>

    <span v-if="label || description" class="text-sm">
      <span v-if="label" class="block font-medium text-slate-900">{{ label }}</span>
      <span v-if="description" class="block text-slate-500">{{ description }}</span>
    </span>
  </label>
</template>
