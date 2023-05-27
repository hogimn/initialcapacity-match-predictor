import React from 'react';
import ReactDOM from 'react-dom';
import './reset.css';
import './theme.css';
import './index.css';
import App from './App/App';
import {appConfig, AppConfigContext} from './App/AppConfig';
import {stateStore} from './App/StateStore';
import {Provider} from 'react-redux';

/**
 * This code uses the ReactDOM.render() function to mount the React application to the DOM.
 * It renders the App component wrapped in necessary providers and enables strict mode.
 */
ReactDOM.render(
    <React.StrictMode>
        {/* Wrapping the appConfig in AppConfigContext.Provider to provide the app configuration */}
        <AppConfigContext.Provider value={appConfig.fromEnv()}>
            {/* Wrapping the entire app in the Redux store Provider to provide the store */}
            <Provider store={stateStore.create()}>
                <App/>
            </Provider>
        </AppConfigContext.Provider>
    </React.StrictMode>,
    // Mounting the application to the DOM element with the 'root' ID
    document.getElementById('root')
);
