import {useSelector} from 'react-redux';
import {AppState} from '../App/StateStore';
import {match, __} from 'ts-pattern';
import {ReactElement} from 'react';
import {Forecast} from './ForecastState';

/**
 * The SingleForecast component represents a single forecast.
 * It takes a `forecast` prop of type `Forecast` and displays the teams and outcome.
 * If a confidence value is provided in the forecast, it also displays the confidence percentage.
 *
 * @param {Object} props - The component props.
 * @param {Forecast} props.forecast - The forecast object.
 * @returns {ReactElement} The rendered SingleForecast component.
 */
const SingleForecast = (props: { forecast: Forecast }): ReactElement => {
    // Destructure the fixture property from props
    const fixture = props.forecast.fixture;

    // Determine the teams based on the forecast outcome using the match function
    const teams = match(props.forecast.outcome)
        // Display home team as strong
        .with('home', () => <><strong>{fixture.home.name}</strong> v. {fixture.away.name}</>)
        // Display away team as strong
        .with('away', () => <>{fixture.home.name} v. <strong>{fixture.away.name}</strong></>)
        // Display both teams as emphasized
        .with('draw', () => <em>{fixture.home.name} v. {fixture.away.name}</em>)
        // Ensure exhaustive pattern matching
        .exhaustive();

    // Generate the confidenceHtml based on the forecast confidence using the match function
    const confidenceHtml = match(props.forecast.confidence)
        // If confidence is undefined, return an empty fragment
        .with(undefined, () => <></>)
        .with(__.number, (confidence) => {
            // Round the confidence to the nearest integer
            const roundedConfidence = Math.round(confidence * 100);
            // Display the rounded confidence percentage
            return <div>Confidence: {roundedConfidence}%</div>;
        })
        // Ensure exhaustive pattern matching
        .exhaustive();

    return <>
        {/* Render the teams and outcome */}
        <div>{teams} ({props.forecast.outcome.toUpperCase()})</div>
        {/* Render the confidence HTML */}
        {confidenceHtml}
    </>;
};

/**
 * Define the ForecastResult component
 *
 * @returns A React element representing the ForecastResult component.
 */
const ForecastResult = (): ReactElement => {
    // Retrieve the forecast data from the app state using the useSelector hook
    const forecast = useSelector((app: AppState) => app.forecast.data);

    // Determine the result based on the forecast using the match function
    const result = match(forecast)
        // Display "Loading" if the forecast is in the loading state
        .with({type: 'loading'}, () => <>Loading</>)
        // Display a message to submit a fixture if the forecast is not loaded
        .with({type: 'not loaded'}, () => <>Submit a fixture to see results</>)
        // Display the SingleForecast component with the refreshing forecast value
        .with({type: 'refreshing'}, ({value}) => <SingleForecast forecast={value}/>)
        // Display the SingleForecast component with the loaded forecast value
        .with({type: 'loaded'}, ({value}) => <SingleForecast forecast={value}/>)
        // Display an error message if the forecast loading failed
        .with({type: 'failure'}, () => <>There was a problem</>)
        // Ensure exhaustive pattern matching
        .exhaustive();

    // Render the determined result
    return <article>{result}</article>;
};

/**
 * Export the ForecastResult component as the default export
 */
export default ForecastResult;
