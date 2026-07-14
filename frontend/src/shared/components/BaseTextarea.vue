<script setup lang="ts">
/**
 * shared/components/BaseTextarea.vue
 *
 * Multiline text input — task descriptions, comment editors, profile
 * bio. Supports multiline text per `UI-UX-guidelines.md` section 23
 * ("Comments... Support multiline text").
 */
import { computed } from 'vue';

interface Props {
  modelValue: string | undefined;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  rows?: number;
  id?: string;
  maxLength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: undefined,
  disabled: false,
  invalid: false,
  rows: 4,
  id: undefined,
  maxLength: undefined,
});

const emit = defineEmits<{ 'update:modelValue': [string]; blur: [FocusEvent] }>();

const textValue = computed({
  get: () => props.modelValue ?? '',
  set: (value: string) => emit('update:modelValue', value),
});

const characterCount = computed(() => textValue.value.length);
</script>

<template>
  <div>
    <textarea
      :id="id"
      v-model="textValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxLength"
      :aria-invalid="invalid"
      class="w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      :class="
        invalid
          ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
          : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
      "
      @blur="emit('blur', $event)"
    />
    <p v-if="maxLength" class="mt-1 text-right text-xs text-slate-400">
      {{ characterCount }} / {{ maxLength }}
    </p>
  </div>
</template>
