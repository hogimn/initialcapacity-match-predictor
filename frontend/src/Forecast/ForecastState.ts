import {Action, Reducer} from 'redux';
import {match} from 'ts-pattern';
import {remoteData, RemoteData} from '../Http/RemoteData';
import {Result} from '../Http/Result';
import {Fixture} from '../Teams/ForecastRequestState';
import {Http} from '../Http/Http';

/**
 * The `Outcome` type represents the possible outcomes of a forecast.
 * It can be either 'home', 'away', or 'draw'.
 */
export type Outcome = 'home' | 'away' | 'draw'

/**
 * The `Forecast` type represents the structure of a forecast.
 */
export type Forecast = {
    fixture: Fixture,
    outcome: Outcome,
    model_name: string
    confidence?: number,
};

/**
 * The `ForecastState` type defines the shape of the forecast state.
 * It contains a `data` property of type `RemoteData<Forecast, Http.Error>`.
 */
export type ForecastState = {
    data: RemoteData<Forecast, Http.Error>
};

/**
 * The initial state of the forecast state.
 */
const initialState: ForecastState = {
    data: remoteData.notLoaded()
};

/**
 * The `ForecastAction` type defines the types of forecast actions.
 */
type ForecastAction =
    | { type: 'forecast/start loading' }
    | { type: 'forecast/finished loading', value: Result<Forecast, Http.Error> }

/**
 * Checks if the given variable is a ForecastAction.
 *
 * @param variable - The variable to check.
 * @returns A boolean indicating if the variable is a ForecastAction.
 */
const isForecastAction = (variable: unknown): variable is ForecastAction =>
    (variable as ForecastAction).type.startsWith('forecast/');

/**
 * The action to start loading the forecast.
 *
 * @returns A ForecastAction representing the start loading action.
 */
const startLoading: ForecastAction =
    {type: 'forecast/start loading'};

/**
 * Creates a finished loading action for the forecast state.
 *
 * @param value - The result value containing the forecast or an error.
 * @returns A ForecastAction representing the finished loading action.
 */
const finishedLoading = (value: Result<Forecast, Http.Error>): ForecastAction =>
    ({type: 'forecast/finished loading', value});

/**
 * Define the reducer for the forecast state.
 *
 * @param state - The current state of the forecast.
 * @param action - The action object dispatched to the reducer.
 * @returns The updated state of the forecast.
 *
 * @description
 * This reducer function handles the state updates for the forecast feature.
 * It receives an action object and updates the forecast state based on the action type.
 */
const reducer: Reducer<ForecastState, Action> =
    (state = initialState, action: Action): ForecastState => {
        // Check if the action is of type ForecastAction
        if (!isForecastAction(action)) return state;

        return match<ForecastAction, ForecastState>(action)
            // When the action type is 'forecast/start loading',
            // return a new state object with the data set to loading state
            .with({type: 'forecast/start loading'}, () => ({data: remoteData.loading()}))
            // When the action type is 'forecast/finished loading',
            // extract the 'value' property from the action object,
            // and return a new state object with the data set to the result of the value,
            // indicating the forecast data is available
            .with({type: 'forecast/finished loading'}, ({value}) => ({data: remoteData.ofResult(value)}))
            .exhaustive();
    };

/**
 * The `forecastState` object provides the following functionality for managing forecast state.
 * It is exported as the default export.
 */
export const forecastState = {
    startLoading,
    finishedLoading,
    reducer,
};
