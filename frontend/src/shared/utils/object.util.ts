/**
 * shared/utils/object.util.ts
 *
 * Framework-agnostic object helpers used by shared composables
 * (`usePagination`, `useLocalStorage`) and components (`DataTable`
 * column/row diffing, `FormField` dirty-checking).
 */

export function pick<TObject extends object, TKey extends keyof TObject>(
  source: TObject,
  keys: readonly TKey[],
): Pick<TObject, TKey> {
  const result = {} as Pick<TObject, TKey>;
  for (const key of keys) {
    if (key in source) {
      result[key] = source[key];
    }
  }
  return result;
}

export function omit<TObject extends object, TKey extends keyof TObject>(
  source: TObject,
  keys: readonly TKey[],
): Omit<TObject, TKey> {
  const result = { ...source };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function isEmptyObject(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  );
}

/** Structural deep-equality check without any external dependency (sufficient for plain DTOs/JSON). */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;

  if (typeof a !== typeof b || a === null || b === null) return false;

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a as object);
    const bKeys = Object.keys(b as object);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) =>
      deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
    );
  }

  return false;
}

/** Deep-clones a plain JSON-serializable value (DTOs, form state) without external dependencies. */
export function deepClone<T>(value: T): T {
  return value === undefined ? value : (JSON.parse(JSON.stringify(value)) as T);
}
