<script setup lang="ts">
/**
 * shared/components/BaseInput.vue
 *
 * Generic single-line text input. Always compose with `FormField` for
 * label/error rendering — this component only owns the control itself,
 * so it remains reusable outside of a labeled form context too (e.g.
 * the Top Bar global search input).
 */
import { computed } from 'vue';

interface Props {
  modelValue: string | number | null;
  type?: 'text' | 'email' | 'password' | 'search' | 'number' | 'url' | 'tel';
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  id?: string;
  autocomplete?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: undefined,
  disabled: false,
  readonly: false,
  invalid: false,
  id: undefined,
  autocomplete: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [string | number | null];
  blur: [FocusEvent];
  focus: [FocusEvent];
}>();

const inputValue = computed({
  get: () => props.modelValue ?? '',
  set: (value: string) => {
    emit('update:modelValue', props.type === 'number' ? Number(value) : value);
  },
});
</script>

<template>
  <input
    :id="id"
    v-model="inputValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :autocomplete="autocomplete"
    :aria-invalid="invalid"
    class="h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
    :class="
      invalid
        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
    "
    @blur="emit('blur', $event)"
    @focus="emit('focus', $event)"
  />
</template>
