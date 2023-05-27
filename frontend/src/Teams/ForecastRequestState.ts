import {Action, Reducer} from 'redux';
import {match} from 'ts-pattern';
import {Team} from './TeamsState';
import {Model} from '../Model/ModelsState';


/**
 * Represents a fixture with home and away teams and the league.
 */
export type Fixture = {
    home: Team,
    away: Team,
    league: string,
}

/**
 * Represents a scenario with the number of minutes elapsed, home goals, and away goals.
 */
export type Scenario = {
    minutesElapsed: number
    homeGoals: number
    awayGoals: number
}

/**
 * Represents the status of a match.
 */
export type MatchStatus =
    | { type: 'not started' }
    | { type: 'in progress' } & Scenario

/**
 * Represents a forecast request with fixture details, selected model, and match status.
 */
export type ForecastRequest = Fixture & {
    model: Model,
    matchStatus: MatchStatus
}

/**
 * Represents the state of a forecast request with partial fixture details, selected model, and match status.
 */
export type ForecastRequestState = Partial<Fixture> & {
    model?: Model,
    matchStatus: MatchStatus
}

/**
 * Represents the state of a forecast request with partial fixture details, selected model, and match status.
 */
const emptyFixture: ForecastRequestState = {matchStatus: {type: 'not started'}};

/**
 * Represents an action related to a fixture.
 */
type FixtureAction =
    | { type: 'fixture/set home', value: Team }
    | { type: 'fixture/set away', value: Team }
    | { type: 'fixture/set model', value: Model }
    | { type: 'fixture/not started' }
    | { type: 'fixture/in progress', value: Scenario}

/**
 * Type guard to check if a variable is of type FixtureAction.
 *
 * @param variable - The variable to check.
 * @returns `true` if the variable is a FixtureAction, `false` otherwise.
 */
const isFixtureAction = (variable: unknown): variable is FixtureAction =>
    (variable as FixtureAction).type.startsWith('fixture/');

/**
 * Action creator for setting the home team.
 *
 * @param value - The home team.
 * @returns The FixtureAction representing the set home action.
 */
const setHome = (value: Team): FixtureAction =>
    ({type: 'fixture/set home', value});

/**
 * Action creator for setting the away team.
 *
 * @param value - The away team.
 * @returns The FixtureAction representing the set away action.
 */
const setAway = (value: Team): FixtureAction =>
    ({type: 'fixture/set away', value});

/**
 * Action creator for setting the model.
 *
 * @param value - The selected model.
 * @returns The FixtureAction representing the set model action.
 */
const setModel = (value: Model): FixtureAction =>
    ({type: 'fixture/set model', value});

/**
 * Action for setting the match status to 'not started'.
 */
const setNotStarted: FixtureAction = { type: 'fixture/not started' };

/**
 * Action creator for setting the match status to 'in progress'.
 *
 * @param value - The scenario representing the match progress.
 * @returns The FixtureAction representing the set in progress action.
 */
const setInProgress = (value: Scenario): FixtureAction =>
    ({type: 'fixture/in progress', value});

/**
 * Reducer function to handle state updates for the forecast request.
 *
 * @param state - The current state of the forecast request.
 * @param action - The action to be performed on the state.
 * @returns The new state after applying the action.
 */
const reducer: Reducer<ForecastRequestState, Action> = (state = emptyFixture, action: Action): ForecastRequestState => {
    // Check if the action is of type FixtureAction
    if (!isFixtureAction(action)) return state;

    // Using the match function from ts-pattern to match against different action types
    return match(action)
        // Matching against { type: 'fixture/set home' }
        .with({type: 'fixture/set home'}, ({value}): ForecastRequestState =>
            // Returning a new state object with the home property updated
            ({...state, home: value})
        )
        // Matching against { type: 'fixture/set away' }
        .with({type: 'fixture/set away'}, ({value}): ForecastRequestState =>
            // Returning a new state object with the away property updated
            ({...state, away: value})
        )
        // Matching against { type: 'fixture/set model' }
        .with({type: 'fixture/set model'}, ({value}): ForecastRequestState =>
            // Returning a new state object with the model property updated
            ({...state, model: value})
        )
        // Matching against { type: 'fixture/not started' }
        .with({type: 'fixture/not started'}, (): ForecastRequestState =>
            // Returning a new state object with the matchStatus property set to 'not started'
            ({...state, matchStatus: {type: 'not started'}})
        )
        // Matching against { type: 'fixture/in progress' }
        .with({type: 'fixture/in progress'}, ({value}): ForecastRequestState =>
            // Returning a new state object with the matchStatus property set to 'in progress' and the provided scenario values
            ({...state, matchStatus: {type: 'in progress', ...value}})
        )
        // Exhaustive check to ensure all action types are handled
        .exhaustive();
};

/**
 * The `forecastRequestState` object provides the following functionality for managing the forecast request state.
 * It is exported as the default export.
 */
export const forecastRequestState = {
    setHome,
    setAway,
    setModel,
    setNotStarted,
    setInProgress,
    reducer,
};
