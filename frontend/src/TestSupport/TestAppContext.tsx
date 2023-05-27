import {AppState, stateStore} from '../App/StateStore';
import {ReactElement, ReactNode} from 'react';
import {Store} from 'redux';
import {Provider} from 'react-redux';
import {AppConfig, AppConfigContext} from '../App/AppConfig';

/**
 * Define the type for an argument of TestAppContext
 */
type TestAppContextProps = {
    store?: Store<AppState>,
    appConfig?: AppConfig,
    children: ReactNode,
}

/**
 * A test utility component for providing a custom Redux store and app configuration to child components.
 *
 * @param props - The properties for the TestAppContext component.
 * @returns The rendered TestAppContext component.
 */
export const TestAppContext = (props: TestAppContextProps): ReactElement => {
    const defaultAppConfig: AppConfig = {
        enableUpcomingGames: true
    };

    return <Provider store={props.store ?? stateStore.create()}>
        <AppConfigContext.Provider value={props.appConfig ?? defaultAppConfig}>
            {props.children}
        </AppConfigContext.Provider>
    </Provider>;
};
