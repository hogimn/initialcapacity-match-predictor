import {FormEvent, ReactElement, useEffect} from 'react';
import {forecastState} from './ForecastState';
import {useDispatch, useSelector} from 'react-redux';
import {forecastApi} from './ForecastApi';
import {result} from '../Http/Result';
import {teamsApi} from '../Teams/TeamsApi';
import {ForecastRequest} from '../Teams/ForecastRequestState';
import TeamPicker from '../Teams/TeamPicker';
import {AppState} from '../App/StateStore';
import {teamsState} from '../Teams/TeamsState';
import {modelsApi} from '../Model/ModelsApi';
import {modelsState} from '../Model/ModelsState';
import ModelPicker from '../Model/ModelPicker';
import InProgressForm from '../InProgress/InProgressForm';

/**
 * The ForecastForm component represents the form for fetching forecasts.
 * It allows users to select home and away teams, choose a model, and submit the form to fetch the forecast.
 */
export const ForecastForm = (): ReactElement => {
    // Retrieve the useDispatch function from the react-redux library
    const dispatch = useDispatch();

    // Retrieve the forecastRequest from the app state using the useSelector hook
    const forecastRequest = useSelector((app: AppState) => app.forecastRequest);

    // Execute the side effect when the component mounts
    useEffect(() => {
        // Dispatch the startLoading action for the teamsState
        dispatch(teamsState.startLoading);
        // Dispatch the startLoading action for the modelsState
        dispatch(modelsState.startLoading);
        // Fetch teams using the teamsApi
        teamsApi.fetch()
            // Dispatch the finishedLoading action with the successful result
            .then(teams => dispatch(teamsState.finishedLoading(result.ok(teams))))
            // Dispatch the finishedLoading action with the error result
            .catch(message => dispatch(teamsState.finishedLoading(result.err(message))));
        // Fetch models using the modelsApi
        modelsApi.fetch()
            // Dispatch the finishedLoading action with the successful result
            .then(models => dispatch(modelsState.finishedLoading(result.ok(models))))
            // Dispatch the finishedLoading action with the error result
            .catch(message => dispatch(teamsState.finishedLoading(result.err(message))));
    }, []);


    // Define the submit function that takes a FormEvent as input
    const submit = (e: FormEvent) => {
        // Prevent the default form submission behavior
        e.preventDefault();
        // Check if any of the required properties (home, away, model) are missing in the forecastRequest
        // Exit the function if any required properties are missing
        if (!forecastRequest.home || !forecastRequest.away || !forecastRequest.model) return;
        // Dispatch the startLoading action for the forecastState
        dispatch(forecastState.startLoading);

        // Fetch the forecast using the forecastApi and the forecastRequest
        forecastApi.fetchFor(forecastRequest as ForecastRequest)
            .then(forecast => {
                // Dispatch the finishedLoading action with the fetched forecast
                dispatch(forecastState.finishedLoading(forecast));
            });
    };

    return <article>
        {/* Render a form component with the onSubmit event handler set to the submit function */}
        <form onSubmit={submit}>
            {/* Render a TeamPicker component with the side prop set to "home" */}
            <TeamPicker side="home"/>
            {/* Render a TeamPicker component with the side prop set to "away" */}
            <TeamPicker side="away"/>
            <fieldset>
                {/* Render a ModelPicker component */}
                <ModelPicker/>
            </fieldset>
            {/* Render an InProgressForm component */}
            <InProgressForm/>

            {/* Render a submit button */}
            <button type="submit">Submit</button>
        </form>
    </article>;
};

/**
 * Export the ForecastForm component as the default export
 */
export default ForecastForm;
