/**
 * shared/composables/useLocalStorage.ts
 *
 * Generic reactive `localStorage` binding for UI preferences (e.g. the
 * Kanban/List view toggle on the Tasks screen, sidebar collapsed
 * state). This is distinct from `core/auth/token-storage.ts`, which
 * owns session/token persistence specifically and must not be
 * duplicated here.
 */

import { ref, watch, type Ref } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const read = (): T => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const storedValue = ref(read()) as Ref<T>;

  watch(
    storedValue,
    (newValue) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch {
        // Storage may be full or unavailable (private browsing); fail silently,
        // the UI preference simply won't persist across reloads.
      }
    },
    { deep: true },
  );

  return storedValue;
}
