<script setup lang="ts">
/**
 * shared/components/BaseDatePicker.vue
 *
 * Date/date-time picker for fields like `Task.dueDate`
 * (`format: date-time` in swagger.yaml). Built on the native
 * `<input type="date">` / `<input type="datetime-local">` rather than
 * a custom calendar widget, for full keyboard/assistive-tech support
 * with zero extra dependency. Always converts to/from full ISO 8601
 * strings at the component boundary so consumers never handle the
 * native input's local, timezone-less string format directly.
 */
import { computed } from 'vue';

interface Props {
  /** ISO 8601 string, or `null` when empty. */
  modelValue: any;
  includeTime?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  min?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  includeTime: false,
  disabled: false,
  invalid: false,
  min: undefined,
  id: undefined,
});

const emit = defineEmits<{ 'update:modelValue': [string | null] }>();

function toNativeValue(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const pad = (value: number): string => value.toString().padStart(2, '0');
  const datePart = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  if (!props.includeTime) return datePart;
  return `${datePart}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const nativeValue = computed({
  get: () => toNativeValue(props.modelValue),
  set: (value: string) => {
    if (!value) {
      emit('update:modelValue', null);
      return;
    }
    const parsed = new Date(value);
    emit('update:modelValue', Number.isNaN(parsed.getTime()) ? null : parsed.toISOString());
  },
});
</script>

<template>
  <input
    :id="id"
    v-model="nativeValue"
    :type="includeTime ? 'datetime-local' : 'date'"
    :disabled="disabled"
    :min="min"
    :aria-invalid="invalid"
    class="h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 transition-colors duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
    :class="
      invalid
        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
    "
  />
</template>
