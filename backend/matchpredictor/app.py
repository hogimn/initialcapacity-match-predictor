from dataclasses import dataclass
from typing import List

from flask import Flask

from matchpredictor.forecast.forecast_api import forecast_api
from matchpredictor.forecast.forecaster import Forecaster
from matchpredictor.health import health_api
from matchpredictor.matchresults.result import Result
from matchpredictor.matchresults.results_provider import training_results
from matchpredictor.model.model_provider import ModelProvider, Model
from matchpredictor.model.models_api import models_api
from matchpredictor.predictors.alphabet_predictor import AlphabetPredictor
from matchpredictor.predictors.home_predictor import HomePredictor
from matchpredictor.predictors.linear_regression_predictor import train_regression_predictor
from matchpredictor.predictors.past_results_predictor import train_results_predictor
from matchpredictor.predictors.support_vector_predictor import train_random_support_vector_predictor
from matchpredictor.predictors.simulation_predictor import train_offense_and_defense_predictor, train_offense_predictor
from matchpredictor.teams.teams_api import teams_api
from matchpredictor.teams.teams_provider import TeamsProvider
from matchpredictor.upcominggames.football_data_api_client import FootballDataApiClient
from matchpredictor.upcominggames.upcoming_games_api import upcoming_games_api


def build_model_provider(training_data: List[Result]) -> ModelProvider:
    """
    Builds the model provider based on the training data.

    Args:
        training_data (List[Result]): The training data used to build the models.

    Returns:
        ModelProvider: The model provider containing the built models.
    """
    return ModelProvider([
        # Model for home prediction
        Model("Home", HomePredictor()),
        # Model based on past results
        Model("Points", train_results_predictor(training_data)),
        # Fast offense simulation model
        Model("Offense simulator (fast)", train_offense_predictor(training_data, 1_000)),
        # Offense simulation model
        Model("Offense simulator", train_offense_predictor(training_data, 10_000)),
        # Fast offense and defense simulation model
        Model("Full simulator (fast)", train_offense_and_defense_predictor(training_data, 1_000)),
        # Offense and defense simulation model
        Model("Full simulator", train_offense_and_defense_predictor(training_data, 10_000)),
        # The linear regression model uses scikit learn, so can cause issues on some machines
        # Model("Linear regression", train_regression_predictor(training_data)),
        # Model for alphabet prediction
        Model("Alphabet simulator", AlphabetPredictor()),
        # Model for support vector prediction
        Model("Support vector simulator", train_random_support_vector_predictor(training_data)),
    ])


@dataclass
class AppEnvironment:
    """
    Represents the configuration environment for the application.

    Attributes:
        csv_location (str): The location of the CSV file containing match data.
        season (int): The current season.
        football_data_api_key (str): The API key for accessing football data.
    """

    csv_location: str
    season: int
    football_data_api_key: str


def create_app(env: AppEnvironment) -> Flask:
    """
    Creates and configures a Flask app based on the provided AppEnvironment.

    Args:
        env (AppEnvironment): The application environment configuration.

    Returns:
        Flask: The configured Flask app.
    """

    app = Flask(__name__)

    # Check if the result belongs to the last two years
    def last_two_years(result: Result) -> bool:
        """
        Checks if a result belongs to the last two years based on the provided season.

        Args:
            result (Result): The result to check.

        Returns:
            bool: True if the result belongs to the last two years, False otherwise.
        """
        return result.season >= env.season - 2

    # Get training results
    results = training_results(env.csv_location, env.season, last_two_years)
    # Extract fixtures from results
    fixtures = list(map(lambda r: r.fixture, results))

    # Create teams provider
    teams_provider = TeamsProvider(fixtures)
    # Build model provider
    models_provider = build_model_provider(results)
    # Create forecaster
    forecaster = Forecaster(models_provider)
    # Create Football Data API client
    football_data_api_client = FootballDataApiClient(env.football_data_api_key)

    # Register forecast API blueprint
    app.register_blueprint(forecast_api(forecaster))
    # Register teams API blueprint
    app.register_blueprint(teams_api(teams_provider))
    # Register models API blueprint
    app.register_blueprint(models_api(models_provider))
    # Register upcoming games API blueprint
    app.register_blueprint(upcoming_games_api(football_data_api_client))
    # Register health API
    app.register_blueprint(health_api())

    return app
