from matchpredictor.matchresults.result import Fixture, Outcome
from matchpredictor.predictors.predictor import Prediction, Predictor


class HomePredictor(Predictor):
    """
    A predictor that always predicts the home team as the outcome.

    Inherits from Predictor.
    """

    def predict(self, fixture: Fixture) -> Prediction:
        """
        Makes a prediction for the given fixture, always predicting the home team as the outcome.

        Args:
            fixture (Fixture): The fixture for which the prediction is made.

        Returns:
            Prediction: The prediction for the fixture with the outcome set as HOME.
        """
        return Prediction(outcome=Outcome.HOME)
