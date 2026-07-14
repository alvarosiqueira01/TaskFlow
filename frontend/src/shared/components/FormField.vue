<script setup lang="ts">
/**
 * shared/components/FormField.vue
 *
 * Wraps a single form control with a label, required-field indicator,
 * help text, and inline validation message — per
 * `UI-UX-guidelines.md` section 16 ("Forms"): clear labels, required
 * indicators, inline validation.
 *
 * Usage:
 *   <FormField label="Email" for="email" :error="fieldErrors.email" required>
 *     <BaseInput id="email" v-model="form.email" type="email" />
 *   </FormField>
 */
import ValidationMessage from './ValidationMessage.vue';

interface Props {
  label?: string;
  for?: string;
  required?: boolean;
  helpText?: string;
  error?: string | null;
}

withDefaults(defineProps<Props>(), {
  label: undefined,
  for: undefined,
  required: false,
  helpText: undefined,
  error: null,
});
</script>

<template>
  <div>
    <label v-if="label" :for="for" class="mb-1.5 block text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-600" aria-hidden="true">*</span>
    </label>

    <slot />

    <ValidationMessage v-if="error" :message="error" variant="error" />
    <ValidationMessage v-else-if="helpText" :message="helpText" variant="help" />
  </div>
</template>
