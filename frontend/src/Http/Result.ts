/**
 * Represents a successful result with data.
 */
export type Ok<T> = {
    // Represents a successful result
    isOk: true
    // The data associated with the successful result
    data: T
}

/**
 * Represents an error result with a reason.
 */
export type Err<E> = {
    // Represents an error result
    isOk: false
    // The reason or error associated with the result
    reason: E
}

/**
 * Represents a result that can be either successful ('Ok') or an error ('Err')
 */
export type Result<T, E> =
    // Represents a successful result with data
    | Ok<T>
    // Represents an error result with a reason
    | Err<E>

/**
 * Creates a successful result with the provided data.
 * @param data The data associated with the successful result.
 * @returns A successful result with the provided data.
 */
const ok = <T, E>(data: T): Result<T, E> => ({
    // Result is successful
    isOk: true,
    // Data associated with the successful result
    data,
});

/**
 * Creates an error result with the provided reason.
 * @param reason The reason or error associated with the result.
 * @returns An error result with the provided reason.
 */
const err = <T, E>(reason: E): Result<T, E> => ({
    // Result is an error
    isOk: false,
    // Reason or error associated with the result
    reason,
});

/**
 * Returns the data if the result is successful, otherwise returns the provided value.
 * @param other The value to return if the result is an error.
 * @returns The data from the result if it is successful, otherwise the provided value.
 */
const orElse = <T, E>(other: T) => (res: Result<T, E>): T =>
    // Return the data if the result is successful, otherwise return the provided value
    res.isOk ? res.data : other;

/**
 * The `result` object provides utility functions for working with result types.
 * It includes functions for creating and manipulating successful and error results.
 * It is exported as a named export.
 */
export const result = {
    ok,
    err,
    orElse,
};
