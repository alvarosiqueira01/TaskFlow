import { computed, onMounted } from 'vue';
import { useUserStore } from '../store/user.store';
import type { UpdateProfileRequest } from '../types/user.types';

export function useUserProfile() {
  const store = useUserStore();

  onMounted(() => {
    if (!store.currentUser) {
      store.loadCurrentUser();
    }
  });

  async function saveProfile(payload: UpdateProfileRequest) {
    return store.updateProfile(payload);
  }

  return {
    currentUser: computed(() => store.currentUser),
    isLoadingProfile: computed(() => store.isLoadingProfile),
    profileError: computed(() => store.profileError),

    isUpdatingProfile: computed(() => store.isUpdatingProfile),
    updateProfileError: computed(() => store.updateProfileError),
    updateProfileFieldErrors: computed(() => store.updateProfileFieldErrors),

    reloadProfile: store.loadCurrentUser,
    saveProfile,
  };
}
