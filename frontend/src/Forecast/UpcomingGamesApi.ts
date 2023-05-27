import {Http, http} from '../Http/Http';
import * as schemawax from 'schemawax';
import {Result} from '../Http/Result';

/**
 * Define and export namespace for the UpcomingGamesApi.
 */
export declare namespace UpcomingGamesApi {
    /**
     * Define the Team type
     */
    type Team = {
        name: string;
        leagues: string[];
    }

    /**
     * Define the UpcomingGame type
     */
    type UpcomingGame = {
        home: Team
        away: Team
    }
}

/**
 * Decoder for the Team type.
 *
 * @returns A decoder for the Team type.
 */
const teamDecoder: schemawax.Decoder<UpcomingGamesApi.Team> =
    schemawax.object({
        required: {
            // Specify that the 'name' property should be a string
            name: schemawax.string,
            // Specify that the 'leagues' property should be an array of strings
            leagues: schemawax.array(schemawax.string)
        }
    });

/**
 * Decoder for the UpcomingGame type.
 *
 * @returns A decoder for the UpcomingGame type.
 */
const upcomingGameDecoder: schemawax.Decoder<UpcomingGamesApi.UpcomingGame> =
    schemawax.object({
        required: {
            // Use the previously defined teamDecoder to decode the 'home' property
            home: teamDecoder,
            // Use the previously defined teamDecoder to decode the 'home' property
            away: teamDecoder
        }
    });

/**
 * Decoder for the array of UpcomingGame type.
 *
 * @param {Object} json - The JSON object to decode.
 * @returns A decoder for the array of UpcomingGame type.
 */
const upcomingGameListDecoder: schemawax.Decoder<UpcomingGamesApi.UpcomingGame[]> =
    schemawax.object({
        required: {
            // Specify that the 'games' property should be an array of UpcomingGame objects
            games: schemawax.array(upcomingGameDecoder)
        }
        // Extract the 'games' property from the decoded object
    }).andThen(json => json.games);

/**
 * Defines the fetch function to retrieve upcoming games.
 *
 * @returns A promise that resolves to a Result object containing the upcoming games or Http.Error.
 */
const fetch = async (): Promise<Result<UpcomingGamesApi.UpcomingGame[], Http.Error>> =>
    http.sendRequest('/api/upcoming-games', upcomingGameListDecoder);

/**
 * The `upcomingGamesApi` object provides the `fetch` function to retrieve upcoming games.
 * It is exported as the default export.
 */
export const upcomingGamesApi = {
    fetch,
};
