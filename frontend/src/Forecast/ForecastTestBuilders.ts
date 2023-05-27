import {Forecast} from './ForecastState';
import {Fixture} from '../Teams/ForecastRequestState';
import {Team} from '../Teams/TeamsState';

/**
 * Default league name.
 */
const defaultLeague =
    'League 1';

/**
 * Default team object with a name and associated leagues.
 *
 * @property {string} name - The team name.
 * @property {string[]} leagues - The leagues the team belongs to.
 */
const defaultTeam: Team = {
    name: 'FC Lorient',
    leagues: [defaultLeague],
};

/**
 * Default fixture object with home and away teams, league, and other properties.
 *
 * @property {Team} away - The away team.
 * @property {Team} home - The home team.
 * @property {string} league - The league of the fixture.
 */
const defaultFixture: Fixture = {
    away: defaultTeam,
    home: {...defaultTeam, name: 'Stade Rennais'},
    league: defaultLeague,
};

/**
 * Default forecast object with confidence, fixture, model name, and outcome.
 *
 * @property {number} confidence - The confidence level of the forecast.
 * @property {Fixture} fixture - The fixture for the forecast.
 * @property {string} model_name - The name of the forecast model.
 * @property {string} outcome - The predicted outcome of the forecast.
 */
const defaultForecast: Forecast = {
    confidence: 0,
    fixture: defaultFixture,
    model_name: '',
    outcome: 'home',
};

/**
 * Generic builder function that takes a default instance and optional arguments to create and customize new instances.
 *
 * @template Builder - The type of the builder.
 * @param defaults - The default instance.
 * @returns The builder function.
 */
const builder = <Builder>(defaults: Builder) => (args: Partial<Builder> = {}): Builder =>
    ({...defaults, ...args});

/**
 * Prepare test data
 */
export const forecastTestBuilders = {
    team: builder(defaultTeam),
    fixture: builder(defaultFixture),
    forecast: builder(defaultForecast),
};
