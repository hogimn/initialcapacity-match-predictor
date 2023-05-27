import {act} from '@testing-library/react';

/**
 * Waits for a promise to settle using the `act` function from React Testing Library.
 *
 * @param promise - The promise to wait for.
 * @returns A Promise that resolves when the provided promise is settled.
 */
export const waitForPromise = async (promise: Promise<unknown>) => {
    try {
        await act(async () => {
            await promise;
        });
        // eslint-disable-next-line no-empty
    } catch {
    }
};

/**
 * Waits for a refresh to occur by waiting for a resolved Promise.
 *
 * @returns A Promise that resolves when the refresh is completed.
 */
export const waitForRefresh = async () => waitForPromise(Promise.resolve());
