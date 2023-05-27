import './App.css';
import logo from '../logo.svg';
import Forecaster from '../Forecast/Forecaster';

/**
 * The Header component represents the header section of the application.
 * It displays the logo image and the title.
 */
const Header = () => <header>
    <div className="container">
        <div className="title">
            {/* Rendering the logo image */}
            <img src={logo} alt="soccer ball logo" className="logo"/>
            {/* Displaying the title */}
            <h1>Match Predictor</h1>
        </div>
    </div>
</header>;

/**
 * The main component of the application.
 * It renders the Header component and the Forecaster component.
 */
const App = () => <>
    {/* Rendering the Header component */}
    <Header/>
    {/* Rendering the Forecaster component */}
    <Forecaster/>
</>;

/**
 * Default export of the App component.
 * This allows the App component to be imported with a default import syntax.
 */
export default App;
