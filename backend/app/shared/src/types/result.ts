export type Result<T, E = string> = SuccessResult<T> | FailureResult<E>;

export interface SuccessResult<T> {
  readonly success: true;
  readonly value: T;
}

export interface FailureResult<E> {
  readonly success: false;
  readonly error: E;
}

export function ok<T>(value: T): SuccessResult<T> { return { success: true, value }; }
export function fail<E>(error: E): FailureResult<E> { return { success: false, error }; }
export function isOk<T, E>(result: Result<T, E>): result is SuccessResult<T> { return result.success; }
export function isFail<T, E>(result: Result<T, E>): result is FailureResult<E> { return !result.success; }
