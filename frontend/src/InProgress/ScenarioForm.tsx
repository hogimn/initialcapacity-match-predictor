import {ReactElement} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../App/StateStore';
import {NumberInput} from '../Forms/Inputs';
import {forecastRequestState} from '../Teams/ForecastRequestState';

/**
 * The `ScenarioForm` component is responsible for rendering the form inputs for capturing the scenario details
 * such as home goals, away goals, and minutes elapsed. It also handles the onChange events and dispatches the
 * corresponding actions to update the forecast request state in the app.
 *
 * @returns {ReactElement} The rendered ScenarioForm component.
 */
const ScenarioForm = (): ReactElement => {
    // Retrieve the useDispatch function from react-redux
    const dispatch = useDispatch();
    // Retrieve the matchStatus from the forecastRequest in the app state
    const matchStatus = useSelector((app: AppState) => app.forecastRequest.matchStatus);

    // If the matchStatus type is 'not started', return an empty fragment
    if (matchStatus.type == 'not started') {
        return <></>;
    }

    // Create a scenario object with the matchStatus values
    const scenario = {
        minutesElapsed: matchStatus.minutesElapsed,
        homeGoals: matchStatus.homeGoals,
        awayGoals: matchStatus.awayGoals,
    };

    return <fieldset>
        { /* Render a NumberInput component for the input home-goals */ }
        <NumberInput
            id="home-goals"
            label="home goals"
            value={scenario.homeGoals}
            min={0}
            onChange={(homeGoals) => dispatch(forecastRequestState.setInProgress({...scenario, homeGoals}))}
            required={true}
        />
        { /* Render a NumberInput component for the input away-goals */ }
        <NumberInput
            id="away-goals"
            label="away goals"
            value={scenario.awayGoals}
            min={0}
            onChange={(awayGoals) => dispatch(forecastRequestState.setInProgress({...scenario, awayGoals}))}
            required={true}
        />
        { /* Render a NumberInput component for the input minutes-elapsed */ }
        <NumberInput
            id="minutes-elapsed"
            label="minutes elapsed"
            value={scenario.minutesElapsed}
            min={0}
            max={90}
            onChange={(minutesElapsed) => dispatch(forecastRequestState.setInProgress({...scenario, minutesElapsed}))}
            required={true}
        />
    </fieldset>;
};

/**
 * The `export default` statement is used to export the `ScenarioForm` component as the default export of the module.
 * It allows you to import the component using the `import` statement without specifying the name of the imported component.
 */
export default ScenarioForm;
