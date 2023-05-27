from matchpredictor.matchresults.result import Fixture, Outcome
from matchpredictor.predictors.predictor import Prediction, Predictor


class AlphabetPredictor(Predictor):
    """
    A predictor that makes predictions based on the alphabetical order of team names.

    Inherits from Predictor.
    """

    def predict(self, fixture: Fixture) -> Prediction:
        """
        Makes a prediction for the given fixture based on the alphabetical order of team names.

        Args:
            fixture (Fixture): The fixture for which the prediction is made.

        Returns:
            Prediction: The prediction for the fixture.
        """
        # Get the name of the home team from the fixture
        home_team_name = fixture.home_team.name
        # Get the name of the away team from the fixture
        away_team_name = fixture.away_team.name

        # Compare the home team name with the away team name
        # If the home team name comes before the away team name alphabetically,
        # set the outcome to HOME, otherwise set it to AWAY
        outcome = Outcome.HOME if home_team_name < away_team_name else Outcome.AWAY

        # Create a new Prediction instance with the determined outcome and return it
        return Prediction(outcome=outcome)
