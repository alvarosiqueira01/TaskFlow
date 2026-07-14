import { computed } from 'vue';
import { useUserStore } from '../store/user.store';
import type { ChangePasswordRequest } from '../types/user.types';

export function useChangePassword() {
  const store = useUserStore();

  async function submit(payload: ChangePasswordRequest) {
    return store.changePassword(payload);
  }

  return {
    isChangingPassword: computed(() => store.isChangingPassword),
    changePasswordError: computed(() => store.changePasswordError),
    changePasswordFieldErrors: computed(() => store.changePasswordFieldErrors),
    changePasswordSuccess: computed(() => store.changePasswordSuccess),

    submit,
    reset: store.resetChangePasswordStatus,
  };
}
