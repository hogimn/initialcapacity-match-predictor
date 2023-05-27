import {Forecast} from './ForecastState';
import * as schemawax from 'schemawax';
import {Http, http} from '../Http/Http';
import {Result} from '../Http/Result';
import {ForecastRequest} from '../Teams/ForecastRequestState';

/**
 * Decoder for the team object.
 *
 * @returns A schemawax decoder for a team object with a `name` property of type string.
 */
const teamDecoder: schemawax.Decoder<{ name: string }> = schemawax.object({required: {name: schemawax.string}});

/**
 * Decoder for the forecast object.
 * Uses schemawax.object() to define an object decoder for the Forecast type.
 * Transforms the decoded JSON into a Forecast object using andThen().
 *
 * @param {Object} json - The JSON object to decode.
 * @returns A schemawax decoder for a forecast object
 */
const forecastDecoder: schemawax.Decoder<Forecast> =
    // Use schemawax.object() to define an object decoder for the Forecast type
    schemawax.object({
        // Define the required properties of the forecast object
        required: {
            fixture: schemawax.object({
                // Define the required properties of the fixture object
                required: {
                    // Use the teamDecoder to decode the home_team property
                    home_team: teamDecoder,
                    // Use the teamDecoder to decode the away_team property
                    away_team: teamDecoder,
                    // Expect a string value for the league property
                    league: schemawax.string,
                }
            }),
            // Expect 'home', 'away', or 'draw' for the outcome property
            outcome: schemawax.literalUnion('home', 'away', 'draw'),
            // Expect a string value for the model_name property
            model_name: schemawax.string
        },
        // Define the optional properties of the forecast object
        optional: {
            // Expect a nullable number for the confidence property
            confidence: schemawax.nullable(schemawax.number)
        }
        // Use andThen() to transform the decoded JSON into a Forecast object
    }).andThen((json): Forecast => ({
        fixture: {
            // Extract the home_team name and league
            home: {name: json.fixture.home_team.name, leagues: [json.fixture.league]},
            // Extract the away_team name and league
            away: {name: json.fixture.away_team.name, leagues: [json.fixture.league]},
            // Extract the away_team name and league
            league: json.fixture.league,
        },
        // Extract the model_name
        model_name: json.model_name,
        // Extract the outcome
        outcome: json.outcome,
        // Extract the confidence if it exists, or set it to undefined
        confidence: json.confidence || undefined,
    }));

/**
 * Fetches the forecast for the given request.
 * @param request - The forecast request containing the necessary information.
 * @returns A promise that resolves to a Result object containing the forecast or Http.Error.
 */
const fetchFor = (request: ForecastRequest): Promise<Result<Forecast, Http.Error>> => {
    // Create a new URLSearchParams object and add the necessary query parameters
    const params = new URLSearchParams({
        // Add the home team name
        home_name: request.home.name,
        // Add the away team name
        away_name: request.away.name,
        // Add the league
        league: request.league,
        // Add the model name
        model_name: request.model.name,
    });

    // Check if the match status type is 'in progress'
    // Then, add additional query parameters for match status in progress
    if (request.matchStatus.type == 'in progress') {
        // Add the home goals
        params.append('home_goals', request.matchStatus.homeGoals.toString());
        // Add the away goals
        params.append('away_goals', request.matchStatus.awayGoals.toString());
        // Add the minutes elapsed
        params.append('minutes_elapsed', request.matchStatus.minutesElapsed.toString());

        // Send a request to the '/api/forecast-in-progress' endpoint with the query parameters and forecastDecoder
        return http.sendRequest(`/api/forecast-in-progress?${params}`, forecastDecoder);
    } else {
        // Send a request to the '/api/forecast' endpoint with the query parameters and forecastDecoder
        return http.sendRequest(`/api/forecast?${params}`, forecastDecoder);
    }
};

/**
 * The `forecastApi` object provides the `fetchFor` method for fetching forecasts based on the given request.
 * It is exported as the default export.
 */
export const forecastApi = {
    fetchFor,
};
