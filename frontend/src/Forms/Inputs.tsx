import './Inputs.css';
import {ReactElement} from 'react';

/**
 * `NumberInput` is a reusable component for rendering a number input field.
 * It takes several props including `id`, `label`, `value`, `onChange`, `required`, `min`, and `max`.
 * It returns a React element representing the rendered number input.
 *
 * @param props An object containing the component's props.
 * @param props.id The unique identifier for the input field.
 * @param props.label The label to display for the input field.
 * @param props.value The current value of the input field.
 * @param props.onChange A callback function invoked when the value of the input field changes.
 * @param props.required Optional. Specifies whether the input field is required.
 * @param props.min Optional. The minimum allowed value for the input field.
 * @param props.max Optional. The maximum allowed value for the input field.
 * @returns A React element representing the rendered number input.
 */
export const NumberInput = (props: {
    id: string;
    label: string;
    value: number | undefined;
    onChange: (value: number) => unknown;
    required?: boolean
    min?: number
    max?: number
}): ReactElement =>
    <label>
        {props.label}
        <input id={props.id}
               type="number"
               placeholder={props.label}
               defaultValue={props.value}
               required={props.required}
               min={props.min}
               max={props.max}
               onChange={e => {
                   const value = parseInt(e.target.value);

                   if (!isNaN(value)) {
                       props.onChange(value);
                   }
               }}
        />
    </label>;

/**
 * `TextInput` is a reusable component for rendering a text input field.
 * It takes several props including `id`, `label`, `value`, `onChange`, and `required`.
 * It returns a React element representing the rendered text input.
 *
 * @param props An object containing the component's props.
 * @param props.id The unique identifier for the input field.
 * @param props.label The label to display for the input field.
 * @param props.value The current value of the input field.
 * @param props.onChange A callback function invoked when the value of the input field changes.
 * @param props.required Optional. Specifies whether the input field is required.
 * @returns A React element representing the rendered text input.
 */
export const TextInput = (props: {
    id: string;
    label: string;
    value: string | undefined;
    onChange: (value: string) => unknown;
    required?: boolean
}): ReactElement =>
    <label>
        {props.label}
        <input id={props.id}
               type="text"
               placeholder={props.label}
               value={props.value}
               required={props.required}
               onChange={e => props.onChange(e.target.value)}
        />
    </label>;

/**
 * `Checkbox` is a reusable component for rendering a checkbox input.
 * It takes several props including `id`, `label`, `checked`, and `onChange`.
 * It returns a React element representing the rendered checkbox input.
 *
 * @param props An object containing the component's props.
 * @param props.id The unique identifier for the checkbox input.
 * @param props.label The label to display for the checkbox.
 * @param props.checked Specifies whether the checkbox is checked.
 * @param props.onChange A callback function invoked when the checkbox's checked state changes.
 * @returns A React element representing the rendered checkbox input.
 */
export const Checkbox = (props: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (value: boolean) => unknown;
}): ReactElement =>
    <label>
        <input id={props.id}
               type="checkbox"
               checked={props.checked}
               onChange={e => props.onChange(e.target.checked)}
        />
        {props.label}
    </label>;

/**
 * Define argument type to be passed to select input component
 */
type SelectProps = {
    id: string
    label: string
    value: string | undefined
    onChange: (value: string) => unknown
    required?: boolean
    options: string[]
    isDisabled?: (optionValue: string) => boolean
};

/**
 * Renders a select input component.
 *
 * @param props - The props for the Select component.
 * @param props.id - The ID of the select element.
 * @param props.label - The label text for the select element.
 * @param props.value - The selected value of the select element.
 * @param props.onChange - The callback function invoked when the selected value changes.
 * @param props.required - Specifies whether the select element is required.
 * @param props.options - An array of options for the select element.
 * @param props.isDisabled - Optional function that determines if an option should be disabled.
 * @returns The rendered Select component.
 */
export const Select = (props: SelectProps): ReactElement => {
    const isDisabled = props.isDisabled ?? (() => false);
    const optionElements = props.options.map(option =>
        <option key={option} value={option} disabled={isDisabled(option)}>
            {option}
        </option>
    );

    return <label>
        {props.label}
        <select
            id={props.id}
            value={props.value}
            required={props.required}
            onChange={e => props.onChange(e.target.value)}
        >

            <option value="">Please choose and option</option>
            {optionElements}
        </select>
    </label>;
};
