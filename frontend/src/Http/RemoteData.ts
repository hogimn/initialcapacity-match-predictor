import {Result} from './Result';

/**
 * Represents RemoteData type to distinguish each state of the data fetch
 */
export type RemoteData<T, E> =
    // Represents the state when data is not loaded
    | { type: 'not loaded', value: undefined, error: undefined }
    // Represents the state when data is being loaded
    | { type: 'loading', value: undefined, error: undefined }
    // Represents the state when data is successfully loaded
    | { type: 'loaded', value: T, error: undefined }
    // Represents the state when data is being refreshed
    | { type: 'refreshing', value: T, error: undefined }
    // Represents the state when data loading or refreshing fails
    | { type: 'failure', value: undefined, error: E }

/**
 * Creates a RemoteData object representing the state when data is not loaded.
 * @returns A RemoteData object with the 'not loaded' state.
 */
const notLoaded = <V, E>(): RemoteData<V, E> => ({
    type: 'not loaded',
    value: undefined,
    error: undefined,
});

/**
 * Creates a RemoteData object representing the state when data is being loaded.
 * @returns A RemoteData object with the 'loading' state.
 */
const loading = <V, E>(): RemoteData<V, E> => ({
    type: 'loading',
    value: undefined,
    error: undefined,
});

/**
 * Creates a RemoteData object representing the state when data is successfully loaded.
 * @param value The loaded data value.
 * @returns A RemoteData object with the 'loaded' state.
 */
const loaded = <V, E>(value: V): RemoteData<V, E> => ({
    type: 'loaded',
    value,
    error: undefined,
});

/**
 * Creates a RemoteData object representing the state when data is being refreshed.
 * @param value The refreshed data value.
 * @returns A RemoteData object with the 'refreshing' state.
 */
const refreshing = <V, E>(value: V): RemoteData<V, E> => ({
    type: 'refreshing',
    value,
    error: undefined,
});

/**
 * Creates a RemoteData object representing the state when data loading or refreshing fails.
 * @param error The error value representing the failure.
 * @returns A RemoteData object with the 'failure' state.
 */
const failure = <V, E>(error: E): RemoteData<V, E> => ({
    type: 'failure',
    value: undefined,
    error,
});

/**
 * Converts a Result object to a RemoteData object.
 * @param result The Result object to convert.
 * @returns A RemoteData object corresponding to the Result state.
 */
const ofResult = <T, E>(result: Result<T, E>): RemoteData<T, E> =>
    result.isOk
        // Converts a successful Result to a loaded RemoteData
        ? loaded(result.data)
        // Converts a failed Result to a failure RemoteData
        : failure(result.reason);

/**
 * Creates a RemoteData object representing the state when data is being loaded.
 * @param oldData The previous data value to be used during the loading state.
 * @returns A RemoteData object with the 'loading' or 'refreshing' state.
 */
const startLoading = <T, E>(oldData?: T): RemoteData<T, E> =>
    oldData === undefined
        // First time loading
        ? loading()
        // There is already an old data loaded before
        : refreshing(oldData);

/**
 * The `remoteData` object provides utility functions for working with remote data states.
 * It includes functions for creating and manipulating different states of remote data.
 * It is exported as a named export.
 */
export const remoteData = {
    notLoaded,
    loading,
    loaded,
    refreshing,
    failure,
    ofResult,
    startLoading,
};
