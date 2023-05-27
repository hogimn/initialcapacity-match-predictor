import {ReactElement, useEffect, useState} from 'react';
import {UpcomingGamesApi, upcomingGamesApi} from './UpcomingGamesApi';
import {remoteData, RemoteData} from '../Http/RemoteData';
import {match} from 'ts-pattern';
import {Http} from '../Http/Http';

/**
 * Component for rendering an individual row of an upcoming game.
 *
 * @param game - The upcoming game data.
 * @returns ReactElement.
 */
const UpcomingGameRow = ({game}: { game: UpcomingGamesApi.UpcomingGame }): ReactElement =>
    <li>
        <dl>
            <dt>Home</dt>
            <dd>{game.home.name}</dd>
            <dt>Away</dt>
            <dd>{game.away.name}</dd>
        </dl>
    </li>;

/**
 * Type definition for the state of the games component.
 */
type GamesState =
    RemoteData<UpcomingGamesApi.UpcomingGame[], Http.Error>

/**
 * Props for the GameList component.
 */
type GameListProps = {
    games: UpcomingGamesApi.UpcomingGame[]
    doRefresh: () => void
}

/**
 * Component for rendering a list of upcoming games.
 *
 * @param games - The array of upcoming games.
 * @param doRefresh - The function to refresh the games.
 * @returns ReactElement.
 */
const GameList = ({games, doRefresh}: GameListProps): ReactElement =>
    <>
        {/* Render a "Refresh" button and attach the doRefresh function to its onClick event */}
        <button onClick={doRefresh}>Refresh</button>
        {/* Render an unordered list */}
        <ul>
            { /* Iterate over the games array and render an UpcomingGameRow component for each game */ }
            {games.map((game, index) => <UpcomingGameRow key={index} game={game}/>)}
        </ul>
    </>;

/**
 * Component for rendering a list of upcoming games.
 *
 * This component manages the state of the games and handles the data loading process.
 * It renders different UI based on the state of the games.
 *
 * @returns ReactElement.
 */
export const UpcomingGameList = (): ReactElement => {

    // State for storing the games
    // Default game state is "not loaded"
    const [gamesState, setGamesState] = useState<GamesState>(remoteData.notLoaded());

    // Function for loading the games
    const loadGames = () => {
        // Set game state as loading or refresh
        setGamesState(remoteData.startLoading(gamesState.value));

        // Fetch upcoming games data from API
        upcomingGamesApi
            .fetch()
            // Set game state as loaded or failure
            .then(result => setGamesState(remoteData.ofResult(result)));
    };

    // Load games on component mount
    useEffect(() => {
        loadGames();
    }, []);

    return match(gamesState)
        // Renders an empty <article> element when games are not loaded */
        .with({type: 'not loaded'}, () =>
            <article/>
        )
        // Renders an <article> element with the text "Loading data..."
        .with({type: 'loading'}, () =>
            <article>Loading data...</article>
        )
        // Renders the <GameList> component with loaded games
        .with({type: 'loaded'}, ({value}) =>
            <article><GameList games={value} doRefresh={loadGames}/></article>
        )
        // Renders the <GameList> component while refreshing data
        .with({type: 'refreshing'}, ({value}) =>
            <article>
                Refreshing data...
                <GameList games={value} doRefresh={loadGames}/>
            </article>
        )
        // Renders an <article> element with an error message
        .with({type: 'failure'}, () =>
            <article>There was an error, please try again later.</article>
        )
        .exhaustive();
};
