/**
 * Declare a global interface for the `window` object to include `env` property
 */
declare global {
    interface Window { env: Record<string, string> }
}

/**
 * Retrieves an environment variable value from the `window` object.
 *
 * @param name - The name of the environment variable to retrieve.
 * @returns The value of the environment variable.
 */
const getEnv = (name: string): string | undefined =>
    window.env[name];

/**
 * Throws an error indicating a missing environment variable configuration.
 *
 * @param name - The name of the missing environment variable.
 * @returns The error message.
 * @throws Error if the environment variable is missing.
 */
const missingConfig = (name: string): string => {
    throw `missing env configuration: ${name}`;
};

/**
 * Requires an environment variable and throws an error if it is missing.
 *
 * @param name - The name of the environment variable to require.
 * @returns The value of the environment variable.
 * @throws Error if the environment variable is missing.
 */
const requireEnv = (name: string): string => {
    const value = getEnv(name);
    return value !== undefined
        ? value
        : missingConfig(name);
};

/**
 * The `env` object provides methods `get` and `require` for accessing environment variables.
 * It is exported as the default export.
 */
export const env = {
    get: getEnv,
    require: requireEnv,
};
