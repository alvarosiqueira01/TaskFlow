/**
 * shared/composables/useDebounce.ts
 *
 * Generic debouncing for reactive values and callbacks. Primary use
 * case per `UI-UX-guidelines.md` section 27 (Performance): debounced
 * search inputs on the Task List / global search bar.
 */

import { onBeforeUnmount, ref, watch, type Ref } from 'vue';

/**
 * Returns a read-only ref that mirrors `source`, but only updates
 * `delayMs` after `source` stops changing.
 *
 * Usage:
 *   const searchTerm = ref('');
 *   const debouncedSearchTerm = useDebouncedRef(searchTerm, 300);
 *   watch(debouncedSearchTerm, (term) => taskService.search(term));
 */
export function useDebouncedRef<T>(source: Ref<T>, delayMs = 300): Ref<T> {
  const debounced = ref(source.value) as Ref<T>;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const stopWatcher = watch(source, (newValue) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      debounced.value = newValue;
    }, delayMs);
  });

  onBeforeUnmount(() => {
    stopWatcher();
    if (timeoutId) clearTimeout(timeoutId);
  });

  return debounced;
}

/** Wraps `callback` so rapid successive calls only execute once, `delayMs` after the last call. */
export function useDebouncedFunction<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs = 300,
): (...args: TArgs) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  onBeforeUnmount(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });

  return (...args: TArgs) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delayMs);
  };
}
