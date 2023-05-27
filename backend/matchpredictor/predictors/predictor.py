from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional

from matchpredictor.matchresults.result import Fixture, Outcome, Scenario


@dataclass
class Prediction:
    """
    Represents the predicted outcome and confidence level.

    Attributes:
        outcome (Outcome): The predicted outcome.
        confidence (Optional[float]): The confidence level of the prediction (optional).
    """
    outcome: Outcome
    confidence: Optional[float] = None


class Predictor(ABC):
    """
    Abstract base class that provides a method to predict the outcome of a fixture.

    Methods:
        predict(fixture: Fixture) -> Prediction:
            Predicts the outcome of the given fixture and returns a Prediction object.
    """

    @abstractmethod
    def predict(self, fixture: Fixture) -> Prediction:
        """
        Predicts the outcome of the given fixture.

        Args:
            fixture (Fixture): The fixture to predict.

        Returns:
            Prediction: The predicted outcome and confidence level.
        """
        pass


class InProgressPredictor(Predictor):
    """
    Subclass of Predictor that provides an additional method to predict the outcome of an in-progress fixture
    based on a given scenario.

    Methods:
        predict_in_progress(fixture: Fixture, scenario: Scenario) -> Prediction:
            Predicts the outcome of the in-progress fixture with the given scenario and returns a Prediction object.
    """

    @abstractmethod
    def predict_in_progress(self, fixture: Fixture, scenario: Scenario) -> Prediction:
        """
        Predicts the outcome of an in-progress fixture based on a given scenario.

        Args:
            fixture (Fixture): The in-progress fixture to predict.
            scenario (Scenario): The scenario to consider for the prediction.

        Returns:
            Prediction: The predicted outcome and confidence level.
        """
        pass
