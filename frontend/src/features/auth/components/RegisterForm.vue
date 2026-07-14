<script setup lang="ts">
/**
 * features/auth/components/RegisterForm.vue
 *
 * Rendered by `pages/RegisterPage.vue`. On success the user is already
 * authenticated (per `AuthResponse`) so we redirect straight to the
 * home route, same as a fresh login.
 */
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { usePasswordStrength } from '../composables/usePasswordStrength';
import { registerFormSchema } from '../types/auth-validation.schemas';
import { mapZodErrorToFieldErrors, type FieldErrorMap } from '../../../shared/validation/field-error-mapper';
import { ROUTE_NAMES } from '../../../core/constants/route-names.constants';
import FormField from '../../../shared/components/FormField.vue';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import ErrorAlert from '../../../shared/components/ErrorAlert.vue';
import ProgressBar from '../../../shared/components/ProgressBar.vue';
import { useToast } from '../../../core/plugins/toast.plugin';
import type { RegisterFormState } from '../types/auth-form.types';

const router = useRouter();
const toast = useToast();
const { register, isLoading, errorMessage, fieldErrors: serverFieldErrors } = useAuth();

const form = reactive<RegisterFormState>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
});
const localFieldErrors = ref<FieldErrorMap>({});

const passwordRef = computed(() => form.password);
const { strength } = usePasswordStrength(passwordRef);

function fieldError(field: keyof RegisterFormState): string | null {
  return localFieldErrors.value[field] ?? serverFieldErrors.value[field] ?? null;
}

async function handleSubmit(): Promise<void> {
  const result = registerFormSchema.safeParse(form);
  if (!result.success) {
    localFieldErrors.value = mapZodErrorToFieldErrors(result.error);
    return;
  }
  localFieldErrors.value = {};

  try {
    await register({
      username: form.username,
      email: form.email,
      password: form.password,
      fullName: form.fullName || undefined,
    });
    toast.success('Account created — welcome!');
    await router.push({ name: ROUTE_NAMES.HOME });
  } catch {
    // errorMessage / fieldErrors are already populated by the store.
  }
}
</script>

<template>
  <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
    <ErrorAlert v-if="errorMessage" :message="errorMessage" />

    <FormField label="Full name" for="register-full-name" :error="fieldError('fullName')">
      <BaseInput
        id="register-full-name"
        v-model="form.fullName"
        autocomplete="name"
        placeholder="Sarah Chen"
        :invalid="Boolean(fieldError('fullName'))"
      />
    </FormField>

    <FormField label="Username" for="register-username" :error="fieldError('username')" required>
      <BaseInput
        id="register-username"
        v-model="form.username"
        autocomplete="username"
        placeholder="sarahchen"
        :invalid="Boolean(fieldError('username'))"
      />
    </FormField>

    <FormField label="Email" for="register-email" :error="fieldError('email')" required>
      <BaseInput
        id="register-email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        :invalid="Boolean(fieldError('email'))"
      />
    </FormField>

    <FormField label="Password" for="register-password" :error="fieldError('password')" required>
      <BaseInput
        id="register-password"
        v-model="form.password"
        type="password"
        autocomplete="new-password"
        placeholder="At least 8 characters"
        :invalid="Boolean(fieldError('password'))"
      />
      <div v-if="strength.level !== 'empty'" class="mt-2 flex items-center gap-2">
        <ProgressBar :value="strength.score" :variant="strength.barVariant" class="flex-1" />
        <span class="text-xs font-medium text-slate-500">{{ strength.label }}</span>
      </div>
    </FormField>

    <FormField label="Confirm password" for="register-confirm-password" :error="fieldError('confirmPassword')" required>
      <BaseInput
        id="register-confirm-password"
        v-model="form.confirmPassword"
        type="password"
        autocomplete="new-password"
        placeholder="Re-enter your password"
        :invalid="Boolean(fieldError('confirmPassword'))"
      />
    </FormField>

    <BaseButton type="submit" block :loading="isLoading">Create account</BaseButton>

    <p class="text-center text-sm text-slate-500">
      Already have an account?
      <router-link :to="{ name: ROUTE_NAMES.LOGIN }" class="font-medium text-blue-600 hover:underline">
        Sign in
      </router-link>
    </p>
  </form>
</template>
