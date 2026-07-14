<script setup lang="ts" generic="TValue extends string">
/**
 * shared/components/BaseSelect.vue
 *
 * Dropdown selection control. Deliberately built on a native
 * `<select>` rather than a custom listbox: it gives full keyboard and
 * screen-reader support for free, matching
 * `UI-UX-guidelines.md` section 26 (Accessibility) without
 * reimplementing ARIA combobox semantics. Visual styling is layered on
 * top via a wrapper + custom chevron so it still matches the rest of
 * the design system.
 */
import { ChevronDown } from 'lucide-vue-next';
import type { SelectOption } from '../types/common.types';

interface Props {
  modelValue: TValue | undefined;
  options: ReadonlyArray<SelectOption<TValue>>;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  disabled: false,
  invalid: false,
  id: undefined,
});

const emit = defineEmits<{ 'update:modelValue': [TValue] }>();

function handleChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value as TValue;
  emit('update:modelValue', value);
}
</script>

<template>
  <div class="relative">
    <select
      :id="id"
      :value="modelValue ?? ''"
      :disabled="disabled"
      :aria-invalid="invalid"
      class="h-10 w-full appearance-none rounded-lg border bg-white px-3 pr-9 text-sm text-slate-900 transition-colors duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      :class="
        invalid
          ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
          : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
      "
      @change="handleChange"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled">
        {{ option.label }}
      </option>
    </select>
    <ChevronDown
      class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      aria-hidden="true"
    />
  </div>
</template>
