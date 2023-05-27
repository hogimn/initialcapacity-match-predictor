import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../App/StateStore';
import {match} from 'ts-pattern';
import {ReactElement} from 'react';
import {ModelList} from './ModelsState';
import {Select} from '../Forms/Inputs';
import {forecastRequestState} from '../Teams/ForecastRequestState';

/**
 * The `ModelSelector` component renders a model selector based on the provided model list.
 *
 * @param {Object} props - The component props.
 * @param {ModelList} props.modelList - The model list containing the available models.
 * @returns {ReactElement} The rendered model selector component.
 */
const ModelSelector = (props: { modelList: ModelList }): ReactElement => {
    const dispatch = useDispatch();
    // Get the selected model from the app state
    const selectedModel = useSelector((app: AppState) => app.forecastRequest.model);

    // Get the list of models from the props
    const models = props.modelList.models;

    const setModel = (modelName: string) => {
        // Find the model with the matching name
        const model = models.filter(t => t.name === modelName).pop();

        if (model) {
            // Dispatch an action to set the selected model in the app state
            dispatch(forecastRequestState.setModel(model));
        }
    };

    return <Select
        id="model-name"
        label="model"
        // Set the selected value based on the selected model
        value={selectedModel?.name}
        required
        // Map the models to an array of option values
        options={models.map(t => t.name)}
        // Call setModel when the value changes
        onChange={modelName => setModel(modelName)}
    />;
};

/**
 * The `ModelPicker` component is responsible for rendering a model selector.
 *
 * @returns {ReactElement} The rendered model picker component.
 */
const ModelPicker = (): ReactElement => {
    // Get the models from the app state
    const models = useSelector((app: AppState) => app.models.data);

    return match(models)
        // Display "Loading" while the models are being loaded
        .with({type: 'loading'}, () => <>Loading</>)
        // "No models available" if the models are not loaded
        .with({type: 'not loaded'}, () => <>No models available</>)
        // Display the ModelSelector component with the loaded models
        .with({type: 'loaded'}, ({value}) => <ModelSelector modelList={value}/>)
        // Display the ModelSelector component with the refreshing models
        .with({type: 'refreshing'}, ({value}) => <ModelSelector modelList={value}/>)
        // Display the error message if fetching the models failed
        .with({type: 'failure'}, data => <>{data.error}</>)
        .exhaustive();
};

/**
 * The `export default` statement is used to export the `ModelPicker` component as the default export of the module.
 * It allows you to import the component using the `import` statement without specifying the name of the imported component.
 */
export default ModelPicker;
