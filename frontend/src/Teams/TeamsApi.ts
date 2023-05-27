import * as schemawax from 'schemawax';
import {http} from '../Http/Http';
import {Team} from './TeamsState';
import {result} from '../Http/Result';

/**
 * Define the decoder for an array of Team objects
 * @param {Object} json - The JSON object to decode.
 */
const teamsDecoder: schemawax.Decoder<Team[]> =
    schemawax.object({
        required: {
            teams: schemawax.array(schemawax.object({
                required: {
                    // Decode the 'name' property as a string
                    name: schemawax.string,
                    // Decode the 'leagues' property as an array of strings
                    leagues: schemawax.array(schemawax.string),
                }
            }))
        }
        // Extract the 'teams' property from the JSON and return it
    }).andThen((json): Team[] => json.teams);

/**
 * Define an empty array of teams
 */
const noTeams: Team[] =
    [];

/**
 * Fetches teams from the API.
 * @returns A Promise that resolves to an array of Team objects.
 */
const fetch = (): Promise<Team[]> => {
    return http
        // Send a request to the '/api/teams' endpoint and decode the response using the teamsDecoder
        .sendRequest('/api/teams', teamsDecoder)
        // If the decoding is successful, return the decoded teams; otherwise, return the empty array of teams
        .then(result.orElse(noTeams));
};

/**
 * Export the teamsApi object with the fetch function
 */
export const teamsApi = {
    fetch,
};
