import React from 'react';
import {env} from './Env';

/**
 * Type definition for the app configuration.
 */
export type AppConfig = {
    enableUpcomingGames: boolean
}

/**
 * Default app configuration with all properties set to their default values.
 */
const emptyAppConfig: AppConfig = {
    enableUpcomingGames: false
};

/**
 * Function to generate the app configuration from environment variables.
 * @returns The generated app configuration.
 */
const fromEnv = (): AppConfig => ({
    enableUpcomingGames: env.get('enableUpcomingGames') === 'true',
});

/**
 * Context object for the app configuration.
 * Context lets the parent component make some information available to any component in the tree below it
 * - no matter how deep — without passing it explicitly through props.
 */
export const AppConfigContext = React.createContext(emptyAppConfig);

/**
 * Export the `appConfig` object as the default export.
 * It provides a method `fromEnv` for creating the app state store.
 */
export const appConfig = {
    fromEnv,
};
