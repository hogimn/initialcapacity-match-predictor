import * as Redux from 'redux';
import {forecastState, ForecastState} from '../Forecast/ForecastState';
import {ForecastRequestState, forecastRequestState} from '../Teams/ForecastRequestState';
import {teamsState, TeamsState} from '../Teams/TeamsState';
import {modelsState, ModelsState} from '../Model/ModelsState';

/**
 * Type definition for the overall app state.
 */
export type AppState = {
    forecast: ForecastState
    forecastRequest: ForecastRequestState
    teams: TeamsState
    models: ModelsState
};

/**
 * Define the app reducer using Redux's combineReducers function
 * @returns The created Redux reducer.
 */
const appReducer: Redux.Reducer<AppState, Redux.Action> =
    Redux.combineReducers({
        forecast: forecastState.reducer,
        forecastRequest: forecastRequestState.reducer,
        teams: teamsState.reducer,
        models: modelsState.reducer,
    });

/**
 * Creates the Redux store using the app reducer.
 * @returns The created Redux store.
 */
const create = (): Redux.Store<AppState> =>
    Redux.createStore(appReducer);

/**
 * Export the `stateStore` object as the default export.
 * It provides a method `create` for creating the app state store.
 */
export const stateStore = {
    create,
};
