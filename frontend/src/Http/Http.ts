import * as schemawax from 'schemawax';
import {result, Result} from './Result';

/**
 * Declare namespace for an error in the HTTP communication.
 */
export declare namespace Http {
    type Error =
        // Represents a connection error
        | { name: 'connection error' }
        // Represents a server error with an optional error message
        | { name: 'server error', message?: string }
        // Represents a deserialization error with an optional JSON string
        | { name: 'deserialization error', json?: string }
}

/**
 * Represents a connection error.
 * @returns Http.Error which has the name 'connection error'
 */
const connectionError: Http.Error =
    // Represents a connection error
    {name: 'connection error'};

/**
 * Represents a server error with an optional error message.
 * @param message The error message, if available.
 * @returns Http.Error which has the name 'server error'
 */
const serverError = (message?: string): Http.Error =>
    // Represents a server error with an optional error message
    ({name: 'server error', message});

/**
 * Represents a deserialization error with an optional JSON string.
 * @param json The JSON string, if available.
 * @returns Http.Error which has the name 'deserialization error'
 */
const deserializationError = (json?: string): Http.Error =>
    // Represents a deserialization error with an optional JSON string
    ({name: 'deserialization error', json});

/**
 * Sends an HTTP request and returns the result.
 * @param request The request to send.
 * @param decoder The decoder to use for decoding the response.
 * @returns A promise that resolves to a Result containing the decoded data or Http.Error.
 */
const sendRequest = async <T>(request: RequestInfo, decoder: schemawax.Decoder<T>): Promise<Result<T, Http.Error>> => {
    const response = await fetch(request).catch(() => undefined);
    if (response === undefined) {
        // Connection error occurred
        return result.err(connectionError);
    }

    if (!response.ok) {
        // Server error occurred with an optional error message
        return response.text()
            .then(message => result.err<T, Http.Error>(serverError(message)))
            .catch(() => result.err(serverError()));
    }

    const json = await response.json().catch(() => undefined);
    if (json === undefined) {
        // Deserialization error occurred
        return result.err(deserializationError());
    }

    const decodedJson = decoder.decode(json);
    if (decodedJson === null) {
        const actualJson = JSON.stringify(json);
        // Deserialization error occurred with the actual JSON string
        return result.err(deserializationError(actualJson));
    }

    // Request succeeded and data was decoded successfully
    return result.ok(decodedJson);
};

/**
 * The `http` object provides utility functions related to HTTP requests and error handling.
 * It is exported as the default export.
 */
export const http = {
    connectionError,
    serverError,
    deserializationError,
    sendRequest
};
