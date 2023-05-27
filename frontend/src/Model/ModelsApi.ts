import * as schemawax from 'schemawax';
import {http} from '../Http/Http';
import {Model} from './ModelsState';
import {result} from '../Http/Result';

/**
 * Decoder for an array of Model objects.
 *
 * @param {Object} json - The JSON object to decode.
 * @returns {Model[]} The decoded array of Model objects.
 */
const modelsDecoder: schemawax.Decoder<Model[]> =
    schemawax.object({
        required: {
            models: schemawax.array(schemawax.object({
                required: {
                    // Decode the 'name' property as a string
                    name: schemawax.string,
                    // Decode the 'predicts_in_progress' property as a boolean
                    predicts_in_progress: schemawax.boolean
                }
            }))
        }
        // Extract the 'models' property from the JSON and return it
    }).andThen(json => json.models);

/**
 * Define an empty array of models
 */
const noModels: Model[] = [];

/**
 * Fetch models from the API.
 *
 * @returns {Promise<Model[]>} A promise that resolves to an array of Model objects.
 */
const fetch = async (): Promise<Model[]> =>
    // Send a request to the '/api/models' endpoint and decode the response using the modelsDecoder
    http.sendRequest('/api/models', modelsDecoder)
        // If the decoding is successful, return the decoded models; otherwise, return the empty array of models
        .then(result.orElse(noModels));

/**
 * The `modelsApi` object provides the `fetch` method for fetching models.
 * It is exported as the default export.
 */
export const modelsApi = {
    fetch,
};
