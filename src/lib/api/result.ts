/**
 * Result type for API operations
 *
 * Provides a type-safe way to handle success/failure states
 * without throwing exceptions for expected errors.
 */

export type Result<T, E = Error> =
  | { ok: true; data: T; error?: never }
  | { ok: false; data?: never; error: E };

export const Result = {
  /**
   * Create a successful result
   */
  ok<T>(data: T): Result<T, never> {
    return { ok: true, data };
  },

  /**
   * Create a failed result
   */
  err<E>(error: E): Result<never, E> {
    return { ok: false, error };
  },

  /**
   * Wrap a promise in a Result
   */
  async fromPromise<T, E = Error>(
    promise: Promise<T>,
    mapError?: (e: unknown) => E
  ): Promise<Result<T, E>> {
    try {
      const data = await promise;
      return Result.ok(data);
    } catch (e) {
      const error = mapError ? mapError(e) : (e as E);
      return Result.err(error);
    }
  },

  /**
   * Check if result is successful
   */
  isOk<T, E>(result: Result<T, E>): result is { ok: true; data: T } {
    return result.ok === true;
  },

  /**
   * Check if result is an error
   */
  isErr<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
    return result.ok === false;
  },

  /**
   * Unwrap the result or throw the error
   */
  unwrap<T, E>(result: Result<T, E>): T {
    if (result.ok) return result.data;
    throw result.error;
  },

  /**
   * Unwrap the result or return a default value
   */
  unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
    return result.ok ? result.data : defaultValue;
  },

  /**
   * Map the success value
   */
  map<T, U, E>(result: Result<T, E>, fn: (data: T) => U): Result<U, E> {
    if (result.ok) {
      return Result.ok(fn(result.data));
    }
    return result;
  },

  /**
   * Map the error value
   */
  mapErr<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
    if (!result.ok) {
      return Result.err(fn(result.error));
    }
    return result;
  },
} as const;
