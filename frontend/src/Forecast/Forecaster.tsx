import React from 'react';
import ForecastForm from './ForecastForm';
import ForecastResult from './ForecastResult';
import {UpcomingGameList} from './UpcomingGameList';
import {AppConfigContext} from '../App/AppConfig';

/**
 * Forecaster component for displaying upcoming games, forecast form, and forecast result.
 * It retrieves the app configuration and renders different sections based on the configuration.
 *
 * @returns A React element representing the Forecaster component.
 */
const Forecaster = (): React.ReactElement => {
    // Accessing the app configuration context
    const appConfig = React.useContext(AppConfigContext);
    // Retrieving the flag for enabling upcoming games
    const enableUpcomingGames = appConfig.enableUpcomingGames;

    return <>
        {enableUpcomingGames &&
            <section>
                <div className="container">
                    {/* Heading for upcoming games */}
                    <h2>Upcoming Games</h2>
                    {/* Rendering the list of upcoming games */}
                    <UpcomingGameList/>
                </div>
            </section>
        }
        <section>
            <div className="container">
                {/* Rendering the list of upcoming games */}
                <h2>Fixture</h2>
                {/* Rendering the forecast form */}
                <ForecastForm/>
            </div>
        </section>
        <section>
            <div className="container">
                {/* Heading for forecast result */}
                <h2>Result</h2>
                {/* Rendering the forecast result */}
                <ForecastResult/>
            </div>
        </section>
    </>;
};

/**
 * Default export of the Forecaster component.
 * This allows the Forecaster component to be imported with a default import syntax.
 */
export default Forecaster;
