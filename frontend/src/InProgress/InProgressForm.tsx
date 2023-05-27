import {ReactElement, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../App/StateStore';
import {match} from 'ts-pattern';
import {Checkbox} from '../Forms/Inputs';
import {forecastRequestState} from '../Teams/ForecastRequestState';
import ScenarioForm from './ScenarioForm';
import './InProgressForm.css';

/**
 * Renders the InProgressPicker component.
 *
 * @returns The rendered InProgressPicker component.
 */
const InProgressPicker = (): ReactElement => {
    // Retrieve the useDispatch function from react-redux
    const dispatch = useDispatch();
    // Retrieve the matchStatus from the forecastRequest in the app state
    const matchStatus = useSelector((app: AppState) => app.forecastRequest.matchStatus);
    // Check if the matchStatus type is 'in progress'
    const inProgress = matchStatus.type == 'in progress';

    const checkbox = <Checkbox
        id="in-progress"
        label="In progress"
        // Set the checked state based on the inProgress variable
        checked={inProgress}
        onChange={(checked) => {
            if (checked) {
                // Dispatch the setInProgress action with initial values when the checkbox is checked
                dispatch(forecastRequestState.setInProgress({
                    awayGoals: 0,
                    homeGoals: 0,
                    minutesElapsed: 0,
                }));
            } else {
                // Dispatch the setNotStarted action when the checkbox is unchecked
                dispatch(forecastRequestState.setNotStarted);
            }
        }}
    />;

    return <fieldset className="column">
        {/* Render the checkbox */}
        {checkbox}
        {/* Render the ScenarioForm component */}
        <ScenarioForm/>
    </fieldset>;
};

/**
 * Renders the InProgressForm component.
 *
 * @returns The rendered InProgressForm component.
 */
const InProgressForm = (): ReactElement => {
    // Retrieve the useDispatch function from react-redux
    const dispatch = useDispatch();
    // Retrieve the model from the forecastRequest in the app state
    const model = useSelector((app: AppState) => app.forecastRequest.model);

    useEffect(() => {
        // Check if the model's predicts_in_progress property is falsy
        if (!model?.predicts_in_progress) {
            // Dispatch the setNotStarted action
            dispatch(forecastRequestState.setNotStarted);
        }
    }, [model]);

    return match(model)
        // Return an empty fragment if the model is undefined
        .with(undefined, () => <></>)
        // Return an empty fragment if predicts_in_progress is false
        .with({predicts_in_progress: false}, () => <></>)
        // Render the InProgressPicker component if predicts_in_progress is true
        .with({predicts_in_progress: true}, () => <InProgressPicker/>)
        .exhaustive();
};

/**
 * The `export default` statement is used to export the `InProgressForm` component as the default export of the module.
 * It allows you to import the component using the `import` statement without specifying the name of the imported component.
 */
export default InProgressForm;
