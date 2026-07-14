/**
 * shared/types/common.types.ts
 *
 * Generic, framework-agnostic utility types reused across every
 * feature. Must remain free of any feature-specific business meaning.
 */

export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

/** Alias for backend UUID identifiers (see swagger.yaml `format: uuid`). */
export type ID = string;

export type SortOrder = 'asc' | 'desc';

/** Generic option shape consumed by `BaseSelect` and similar controls. */
export interface SelectOption<TValue = string> {
  label: string;
  value: TValue;
  disabled?: boolean;
}

/** Common size scale reused by Base* components. */
export type ComponentSize = 'sm' | 'md' | 'lg';

/** Common visual intent/variant scale reused by Button, Alert, Badge, Toast. */
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';

/** Common shape for tracking an async operation in component/composable state. */
export interface AsyncState<TData> {
  data: Nullable<TData>;
  isLoading: boolean;
  error: Nullable<string>;
}
