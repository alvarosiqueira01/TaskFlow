import { computed, onMounted } from 'vue';
import { useSettingsStore } from '../store/settings.store';

export function useRolesCatalog() {
  const store = useSettingsStore();

  onMounted(() => {
    if (store.roles.length === 0) {
      store.loadRoles();
    }
  });

  return {
    roles: computed(() => store.roles),
    isLoadingRoles: computed(() => store.isLoadingRoles),
    rolesError: computed(() => store.rolesError),
    reloadRoles: store.loadRoles,
  };
}
