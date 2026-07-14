<script setup lang="ts">
/**
 * features/auth/components/ForgotPasswordForm.vue
 *
 * `POST /auth/password/recovery` always responds `202 Accepted`
 * regardless of whether the email exists (see `AuthService`'s doc
 * comment) — the UI must not leak account existence either, so the
 * success state is a single neutral message shown in place of the
 * form, not a toast tied to a specific email.
 */
import { reactive, ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { forgotPasswordFormSchema } from '../types/auth-validation.schemas';
import { mapZodErrorToFieldErrors, type FieldErrorMap } from '../../../shared/validation/field-error-mapper';
import { ROUTE_NAMES } from '../../../core/constants/route-names.constants';
import FormField from '../../../shared/components/FormField.vue';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import ErrorAlert from '../../../shared/components/ErrorAlert.vue';
import type { ForgotPasswordFormState } from '../types/auth-form.types';

const { requestPasswordRecovery, isLoading, errorMessage, fieldErrors: serverFieldErrors } = useAuth();

const form = reactive<ForgotPasswordFormState>({ email: '' });
const localFieldErrors = ref<FieldErrorMap>({});
const isSubmitted = ref(false);

function fieldError(field: keyof ForgotPasswordFormState): string | null {
  return localFieldErrors.value[field] ?? serverFieldErrors.value[field] ?? null;
}

async function handleSubmit(): Promise<void> {
  const result = forgotPasswordFormSchema.safeParse(form);
  if (!result.success) {
    localFieldErrors.value = mapZodErrorToFieldErrors(result.error);
    return;
  }
  localFieldErrors.value = {};

  try {
    await requestPasswordRecovery(result.data);
    isSubmitted.value = true;
  } catch {
    // errorMessage is already populated by the store.
  }
}
</script>

<template>
  <div v-if="isSubmitted" class="space-y-4 text-center">
    <p class="text-sm text-slate-600">
      If an account exists for that email address, we've sent instructions to reset the password.
    </p>
    <router-link :to="{ name: ROUTE_NAMES.LOGIN }" class="text-sm font-medium text-blue-600 hover:underline">
      Back to sign in
    </router-link>
  </div>

  <form v-else class="space-y-5" novalidate @submit.prevent="handleSubmit">
    <ErrorAlert v-if="errorMessage" :message="errorMessage" />

    <p class="text-sm text-slate-500">
      Enter the email associated with your account and we'll send you a link to reset your password.
    </p>

    <FormField label="Email" for="forgot-password-email" :error="fieldError('email')" required>
      <BaseInput
        id="forgot-password-email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        :invalid="Boolean(fieldError('email'))"
      />
    </FormField>

    <BaseButton type="submit" block :loading="isLoading">Send reset link</BaseButton>

    <p class="text-center text-sm text-slate-500">
      <router-link :to="{ name: ROUTE_NAMES.LOGIN }" class="font-medium text-blue-600 hover:underline">
        Back to sign in
      </router-link>
    </p>
  </form>
</template>
