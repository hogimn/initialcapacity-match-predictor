import {Action, Reducer} from 'redux';
import {match} from 'ts-pattern';
import {remoteData, RemoteData} from '../Http/RemoteData';
import {Result} from '../Http/Result';


/**
 * Define the types for team
 */
export type Team = {
    name: string;
    leagues: string[];
}

/**
 * Define the types for team Lists
 */
export type TeamList = {
    teams: Team[];
    leagues: string[];
}

/**
 * Define the teams state shape
 */
export type TeamsState = {
    data: RemoteData<TeamList, string>
};

/**
 * Set the initial state of the teams state.
 *
 * @returns The initial teams state.
 */
const initialState: TeamsState = {
    data: remoteData.notLoaded()
};

/**
 * Define the possible actions for teams.
 */
type TeamsAction =
    | { type: 'teams/start loading' }
    | { type: 'teams/finished loading', value: Result<Team[], string> }

/**
 * Type guard to check if a variable is a TeamsAction.
 *
 * @param variable - The variable to check.
 * @returns A boolean indicating whether the variable is a TeamsAction.
 */
const isTeamsAction = (variable: unknown): variable is TeamsAction =>
    (variable as TeamsAction).type.startsWith('teams/');

/**
 * Action creator for starting the loading process.
 *
 * @returns A TeamsAction representing the start loading action.
 */
const startLoading: TeamsAction =
    {type: 'teams/start loading'};

/**
 * Action creator for finishing the loading process.
 *
 * @param value - The result of the loading process.
 * @returns A TeamsAction representing the finished loading action.
 */
const finishedLoading = (value: Result<Team[], string>): TeamsAction =>
    ({type: 'teams/finished loading', value});

/**
 * Reducer function to handle state updates for teams.
 *
 * @param state - The current teams state.
 * @param action - The action to be applied to the state.
 * @returns The updated teams state.
 */
const reducer: Reducer<TeamsState, Action> = (state = initialState, action: Action): TeamsState => {
    // Check if the action is a TeamsAction
    if (!isTeamsAction(action)) return state;

    return match(action)
        .with({type: 'teams/start loading'}, (): TeamsState => ({
            data: remoteData.loading()
        }))
        .with({type: 'teams/finished loading'}, ({value}): TeamsState => {
            if (value.isOk) {
                // If loading is successful, update the state with loaded data
                return {
                    data: remoteData.loaded({
                        teams: value.data,
                        leagues: Array.from(new Set(value.data.flatMap(t => t.leagues))).sort()
                    })
                };
            } else {
                // If loading fails, update the state with the failure reason
                return {data: remoteData.failure(value.reason)};
            }
        })
        // Ensure all action types are covered
        .exhaustive();
};

/**
 * The `teamsState` object provides the following functionality for managing team state.
 * It is exported as the default export.
 */
export const teamsState = {
    startLoading,
    finishedLoading,
    reducer,
};
