import { computed } from 'vue';
import { useSettingsStore } from '../store/settings.store';

export function useUserRoleManager() {
  const store = useSettingsStore();

  async function lookupUser(userId: string) {
    const trimmed = userId.trim();
    if (!trimmed) {
      return;
    }
    await store.lookupUserRoles(trimmed);
  }

  async function saveRoles(roleIds: string[]) {
    if (!store.lookedUpUserId) {
      return false;
    }
    return store.saveUserRoles(store.lookedUpUserId, roleIds);
  }

  return {
    lookedUpUserId: computed(() => store.lookedUpUserId),
    userRoles: computed(() => store.userRoles),
    isLoadingUserRoles: computed(() => store.isLoadingUserRoles),
    userRolesError: computed(() => store.userRolesError),

    isSavingUserRoles: computed(() => store.isSavingUserRoles),
    saveUserRolesError: computed(() => store.saveUserRolesError),
    saveUserRolesFieldErrors: computed(() => store.saveUserRolesFieldErrors),
    saveUserRolesSuccess: computed(() => store.saveUserRolesSuccess),

    lookupUser,
    saveRoles,
    clearLookup: store.resetUserRoleLookup,
  };
}
