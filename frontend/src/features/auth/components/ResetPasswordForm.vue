<script setup lang="ts">
/**
 * features/auth/components/ResetPasswordForm.vue
 *
 * Rendered by `pages/ResetPasswordPage.vue`, which extracts the
 * recovery `token` from the route query string (the link sent by
 * `POST /auth/password/recovery`) and passes it down as a prop — this
 * component has no router/query-string knowledge of its own.
 */
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { usePasswordStrength } from '../composables/usePasswordStrength';
import { resetPasswordFormSchema } from '../types/auth-validation.schemas';
import { mapZodErrorToFieldErrors, type FieldErrorMap } from '../../../shared/validation/field-error-mapper';
import { ROUTE_NAMES } from '../../../core/constants/route-names.constants';
import FormField from '../../../shared/components/FormField.vue';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import ErrorAlert from '../../../shared/components/ErrorAlert.vue';
import ProgressBar from '../../../shared/components/ProgressBar.vue';
import { useToast } from '../../../core/plugins/toast.plugin';
import type { ResetPasswordFormState } from '../types/auth-form.types';

interface Props {
  token: string;
}

const props = defineProps<Props>();

const router = useRouter();
const toast = useToast();
const { resetPassword, isLoading, errorMessage, fieldErrors: serverFieldErrors } = useAuth();

const form = reactive<ResetPasswordFormState>({ newPassword: '', confirmPassword: '' });
const localFieldErrors = ref<FieldErrorMap>({});

const passwordRef = computed(() => form.newPassword);
const { strength } = usePasswordStrength(passwordRef);

function fieldError(field: keyof ResetPasswordFormState): string | null {
  return localFieldErrors.value[field] ?? serverFieldErrors.value[field] ?? null;
}

async function handleSubmit(): Promise<void> {
  const result = resetPasswordFormSchema.safeParse(form);
  if (!result.success) {
    localFieldErrors.value = mapZodErrorToFieldErrors(result.error);
    return;
  }
  localFieldErrors.value = {};

  try {
    await resetPassword({ token: props.token, newPassword: result.data.newPassword });
    toast.success('Password updated — please sign in.');
    await router.push({ name: ROUTE_NAMES.LOGIN });
  } catch {
    // errorMessage / fieldErrors are already populated by the store.
  }
}
</script>

<template>
  <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
    <ErrorAlert v-if="errorMessage" :message="errorMessage" />

    <FormField label="New password" for="reset-new-password" :error="fieldError('newPassword')" required>
      <BaseInput
        id="reset-new-password"
        v-model="form.newPassword"
        type="password"
        autocomplete="new-password"
        placeholder="At least 8 characters"
        :invalid="Boolean(fieldError('newPassword'))"
      />
      <div v-if="strength.level !== 'empty'" class="mt-2 flex items-center gap-2">
        <ProgressBar :value="strength.score" :variant="strength.barVariant" class="flex-1" />
        <span class="text-xs font-medium text-slate-500">{{ strength.label }}</span>
      </div>
    </FormField>

    <FormField label="Confirm new password" for="reset-confirm-password" :error="fieldError('confirmPassword')" required>
      <BaseInput
        id="reset-confirm-password"
        v-model="form.confirmPassword"
        type="password"
        autocomplete="new-password"
        placeholder="Re-enter your new password"
        :invalid="Boolean(fieldError('confirmPassword'))"
      />
    </FormField>

    <BaseButton type="submit" block :loading="isLoading">Reset password</BaseButton>
  </form>
</template>
