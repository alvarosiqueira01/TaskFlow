import { computed } from 'vue';
import { useUserStore } from '../store/user.store';
import type { UserPreferences } from '../types/user.types';

/**
 * Exposes the session-only preference toggles. See the UserPreferences
 * doc comment in user.types.ts: there is currently no backend endpoint
 * to persist these, so they only live in the store for the current
 * session and reset on reload.
 */
export function useUserPreferences() {
  const store = useUserStore();

  function togglePreference(key: keyof UserPreferences) {
    store.setPreference(key, !store.preferences[key]);
  }

  return {
    preferences: computed(() => store.preferences),
    togglePreference,
  };
}
