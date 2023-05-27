from dataclasses import dataclass
from typing import Optional

from matchpredictor.matchresults.result import Fixture, Team, Outcome, Scenario
from matchpredictor.model.model_provider import ModelProvider


from typing import Optional
from dataclasses import dataclass


# Represents a forecast for a fixture
@dataclass(frozen=True)
class Forecast(object):
    """
    Dataclass to represent a forecast for a fixture.

    Attributes:
        fixture (Fixture): The fixture for which the forecast is made.
        model_name (str): The name of the model used for the forecast.
        outcome (Outcome): The predicted outcome of the fixture.
        confidence (Optional[float]): The confidence level of the prediction (optional).
    """
    fixture: Fixture
    model_name: str
    outcome: Outcome
    confidence: Optional[float]


# Checks if a fixture is invalid (e.g., home team and away team have the same name)
def fixture_is_invalid(fixture: Fixture) -> bool:
    """
    Checks if a fixture is invalid.

    Args:
        fixture (Fixture): The fixture to check.

    Returns:
        bool: True if the fixture is invalid, False otherwise.
    """
    return fixture.home_team.name == fixture.away_team.name


class Forecaster:
    """
    Class for making forecasts using a model provider.

    Attributes:
        model_provider (ModelProvider): The model provider object.

    Methods:
        forecast(fixture: Fixture, model_name: str) -> Optional[Forecast]:
            Makes a forecast for a given fixture and model.
        forecast_in_progress(fixture: Fixture, scenario: Scenario, model_name: str) -> Optional[Forecast]:
            Makes a forecast for a fixture in progress, given a scenario and model.
    """
    def __init__(self, model_provider: ModelProvider) -> None:
        """
        Initializes the Forecaster with a ModelProvider.

        Args:
            model_provider (ModelProvider): The model provider object.
        """
        self.__model_provider = model_provider

    def forecast(self, fixture: Fixture, model_name: str) -> Optional[Forecast]:
        """
        Makes a forecast for a given fixture and model.

        Args:
            fixture (Fixture): The fixture for which to make the forecast.
            model_name (str): The name of the model to use for the forecast.

        Returns:
            Optional[Forecast]: The forecast for the fixture, or None if the fixture is invalid or the predictor is not available.
        """
        # If the fixture is invalid, return None
        if fixture_is_invalid(fixture):
            return None

        # If the predictor for the given model is not available, return None
        predictor = self.__model_provider.get_predictor(model_name)
        if predictor is None:
            return None

        # Make a prediction for the given fixture using the selected predictor
        prediction = predictor.predict(fixture)

        # Create a Forecast object with the fixture, model name, predicted outcome, and confidence level
        # Return the Forecast object as the result of the forecast
        return Forecast(
            fixture=fixture,
            model_name=model_name,
            outcome=prediction.outcome,
            confidence=prediction.confidence
        )

    def forecast_in_progress(self, fixture: Fixture, scenario: Scenario, model_name: str) -> Optional[Forecast]:
        """
        Makes a forecast for a fixture in progress, given a scenario and model.

        Args:
            fixture (Fixture): The fixture for which to make the forecast.
            scenario (Scenario): The scenario of the fixture in progress.
            model_name (str): The name of the model to use for the forecast.

        Returns:
            Optional[Forecast]: The forecast for the in-progress fixture, or None if the fixture is invalid or the predictor is not available.
        """
        # If the fixture is invalid, return None
        if fixture_is_invalid(fixture):
            return None

        # If the predictor for the given model is not available, return None
        predictor = self.__model_provider.get_in_progress_predictor(model_name)
        if predictor is None:
            return None

        # Make an in-progress prediction for the given fixture and scenario using the selected predictor
        prediction = predictor.predict_in_progress(fixture, scenario)

        # Create a Forecast object with the fixture, model name, predicted outcome, and confidence level
        # Return the Forecast object as the result of the forecast_in_progress
        return Forecast(
            fixture=fixture,
            model_name=model_name,
            outcome=prediction.outcome,
            confidence=prediction.confidence
        )
