import {Action, Reducer} from 'redux';
import {match} from 'ts-pattern';
import {remoteData, RemoteData} from '../Http/RemoteData';
import {Result} from '../Http/Result';


/**
 * Interface representing a model.
 *
 * @interface Model
 * @property {string} name - The name of the model.
 * @property {boolean} predicts_in_progress - Indicates whether the model predicts in progress.
 */
export interface Model {
    name: string;
    predicts_in_progress: boolean;
}

/**
 * Interface representing a list of models.
 *
 * @interface ModelList
 * @property {Model[]} models - The array of models.
 */
export interface ModelList {
    models: Model[];
}

/**
 * Shape of the ModelsState.
 *
 * @type {ModelsState}
 * @property {RemoteData<ModelList, string>} data - The remote data representing the model list.
 */
export type ModelsState = {
    data: RemoteData<ModelList, string>
};

/**
 * Set the initial state of the ModelsState
 */
const initialState: ModelsState = {
    data: remoteData.notLoaded()
};

/**
 * Define the possible actions for models
 */
type ModelsAction =
    | { type: 'models/start loading' }
    | { type: 'models/finished loading', value: Result<Model[], string> }

/**
 * Type guard to check if a variable is a ModelsAction.
 *
 * @param variable - The variable to check.
 * @returns `true` if the variable is a ModelsAction, `false` otherwise.
 */
const isModelsAction = (variable: unknown): variable is ModelsAction =>
    (variable as ModelsAction).type.startsWith('models/');

/**
 * Action creator for starting the loading process.
 *
 * @returns The ModelsAction representing the start loading action.
 */
const startLoading: ModelsAction =
    {type: 'models/start loading'};

/**
 * Action creator for finishing the loading process.
 *
 * @param value - The result value containing either the loaded data or the failure reason.
 * @returns The ModelsAction representing the finished loading action.
 */
const finishedLoading = (value: Result<Model[], string>): ModelsAction =>
    ({type: 'models/finished loading', value});

/**
 * Reducer function to handle state updates.
 *
 * @param state - The current state.
 * @param action - The action to process.
 * @returns The updated state.
 */
const reducer: Reducer<ModelsState, Action> = (state = initialState, action: Action): ModelsState => {
    // Check if the action is a ModelsAction
    if (!isModelsAction(action)) return state;

    return match(action)
        .with({type: 'models/start loading'}, (): ModelsState => ({
            data: remoteData.loading()
        }))
        .with({type: 'models/finished loading'}, ({value}): ModelsState => {
            // If loading is successful, update the state with loaded data
            if (value.isOk) {
                return {
                    data: remoteData.loaded({
                        models: value.data,
                    })
                };
                // If loading fails, update the state with the failure reason
            } else {
                return {data: remoteData.failure(value.reason)};
            }
        })
        // Ensure all action types are covered
        .exhaustive();
};

/**
 * The `modelsState` object provides the following functionality for managing model state.
 * It is exported as the default export.
 */
export const modelsState = {
    startLoading,
    finishedLoading,
    reducer,
};
