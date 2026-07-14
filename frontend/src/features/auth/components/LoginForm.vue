<script setup lang="ts">
/**
 * features/auth/components/LoginForm.vue
 *
 * Rendered by `pages/LoginPage.vue` inside `<AuthLayout>`. On success,
 * redirects to whatever route the user was trying to reach before
 * `core/router/guards/auth.guard.ts` sent them to login (see
 * `consumeRedirectAfterLogin`), falling back to the home route.
 */
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { loginFormSchema } from '../types/auth-validation.schemas';
import { mapZodErrorToFieldErrors, type FieldErrorMap } from '../../../shared/validation/field-error-mapper';
import { consumeRedirectAfterLogin } from '../../../core/auth/token-storage';
import { ROUTE_NAMES } from '../../../core/constants/route-names.constants';
import FormField from '../../../shared/components/FormField.vue';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import ErrorAlert from '../../../shared/components/ErrorAlert.vue';
import type { LoginFormState } from '../types/auth-form.types';

const router = useRouter();
const { login, isLoading, errorMessage, fieldErrors: serverFieldErrors } = useAuth();

const form = reactive<LoginFormState>({ email: '', password: '' });
const localFieldErrors = ref<FieldErrorMap>({});

function fieldError(field: keyof LoginFormState): string | null {
  return localFieldErrors.value[field] ?? serverFieldErrors.value[field] ?? null;
}

async function handleSubmit(): Promise<void> {
  const result = loginFormSchema.safeParse(form);
  if (!result.success) {
    localFieldErrors.value = mapZodErrorToFieldErrors(result.error);
    return;
  }
  localFieldErrors.value = {};

  try {
    await login(result.data);
    const redirectPath = consumeRedirectAfterLogin();
    if (redirectPath) {
      await router.push(redirectPath);
    } else {
      await router.push({ name: ROUTE_NAMES.HOME });
    }
  } catch {
    // errorMessage / fieldErrors are already populated by the store; nothing further to do here.
  }
}
</script>

<template>
  <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
    <ErrorAlert v-if="errorMessage" :message="errorMessage" />

    <FormField label="Email" for="login-email" :error="fieldError('email')" required>
      <BaseInput
        id="login-email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        :invalid="Boolean(fieldError('email'))"
      />
    </FormField>

    <FormField label="Password" for="login-password" :error="fieldError('password')" required>
      <BaseInput
        id="login-password"
        v-model="form.password"
        type="password"
        autocomplete="current-password"
        placeholder="Enter your password"
        :invalid="Boolean(fieldError('password'))"
      />
    </FormField>

    <div class="flex justify-end">
      <router-link
        :to="{ name: ROUTE_NAMES.FORGOT_PASSWORD }"
        class="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
      >
        Forgot password?
      </router-link>
    </div>

    <BaseButton type="submit" block :loading="isLoading">Sign in</BaseButton>

    <p class="text-center text-sm text-slate-500">
      Don't have an account?
      <router-link :to="{ name: ROUTE_NAMES.REGISTER }" class="font-medium text-blue-600 hover:underline">
        Create one
      </router-link>
    </p>
  </form>
</template>
