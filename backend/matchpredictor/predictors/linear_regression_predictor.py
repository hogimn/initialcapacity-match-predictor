from typing import List, Tuple, Optional, cast

import numpy as np
from numpy import float64
from numpy.typing import NDArray
from sklearn.linear_model import LogisticRegression  # type: ignore
from sklearn.preprocessing import OneHotEncoder  # type: ignore

from matchpredictor.matchresults.result import Fixture, Outcome, Result, Team
from matchpredictor.predictors.predictor import Predictor, Prediction


class LinearRegressionPredictor(Predictor):
    """
    A predictor that uses linear regression to make predictions based on team encodings.

    Inherits from Predictor.
    """

    def __init__(self, model: LogisticRegression, team_encoding: OneHotEncoder) -> None:
        """
        Initializes the LinearRegressionPredictor with a logistic regression model and a team encoding.

        Args:
            model (LogisticRegression): The logistic regression model used for prediction.
            team_encoding (OneHotEncoder): The team encoding used to transform team names.
        """
        self.model = model
        self.team_encoding = team_encoding

    def predict(self, fixture: Fixture) -> Prediction:
        """
        Makes a prediction for the given fixture using linear regression and team encodings.

        Args:
            fixture (Fixture): The fixture for which the prediction is made.

        Returns:
            Prediction: The prediction for the fixture.
        """
        # Encode the home team name
        encoded_home_name = self.__encode_team(fixture.home_team)
        # Encode the away team name
        encoded_away_name = self.__encode_team(fixture.away_team)

        # If home team name encoding is None, predict AWAY
        if encoded_home_name is None:
            return Prediction(outcome=Outcome.AWAY)
        # If away team name encoding is None, predict HOME
        if encoded_away_name is None:
            return Prediction(outcome=Outcome.HOME)

        # Concatenate the encoded team names
        x: NDArray[float64] = np.concatenate([encoded_home_name, encoded_away_name], 1)
        # Make a prediction using the model
        pred = self.model.predict(x)

        # If prediction is positive, predict HOME
        if pred > 0:
            return Prediction(outcome=Outcome.HOME)
        # If prediction is negative, predict AWAY
        elif pred < 0:
            return Prediction(outcome=Outcome.AWAY)
        # If prediction is zero, predict DRAW
        else:
            return Prediction(outcome=Outcome.DRAW)

    def __encode_team(self, team: Team) -> Optional[NDArray[float64]]:
        """
        Encodes the team name using the team encoding.

        Args:
            team (Team): The team to encode.

        Returns:
            Optional[ndarray]: The encoded team name, or None if encoding fails.
        """
        try:
            # Transform the team name using the encoding
            result: NDArray[float64] = self.team_encoding.transform(np.array(team.name).reshape(-1, 1))
            return result
        except ValueError:
            # Return None if encoding fails
            return None


def build_model(results: List[Result]) -> Tuple[LogisticRegression, OneHotEncoder]:
    """
    Builds a logistic regression model for predicting match outcomes based on historical results.

    Args:
        results (List[Result]): A list of historical match results used for training the model.

    Returns:
        Tuple[LogisticRegression, OneHotEncoder]: A tuple containing the trained logistic regression model
            and the one-hot encoder used for team name encoding.
    """
    # Extract home team names, away team names, home goals, and away goals from the results
    home_names = np.array([r.fixture.home_team.name for r in results])
    away_names = np.array([r.fixture.away_team.name for r in results])
    home_goals = np.array([r.home_goals for r in results])
    away_goals = np.array([r.away_goals for r in results])

    # Combine home and away team names into a single array
    team_names = np.array(list(home_names) + list(away_names)).reshape(-1, 1)
    # Create a one-hot encoder and fit it to the team names
    team_encoding = OneHotEncoder(sparse=False).fit(team_names)

    # Encode home team names using the one-hot encoder
    encoded_home_names = team_encoding.transform(home_names.reshape(-1, 1))
    # Encode away team names using the one-hot encoder
    encoded_away_names = team_encoding.transform(away_names.reshape(-1, 1))

    # Concatenate the encoded home and away team names into a single feature matrix
    x: NDArray[float64] = np.concatenate([encoded_home_names, encoded_away_names], 1)
    # Assign a positive value (1) for home team wins, a negative value (-1) for away team wins, and 0 for draws.
    y = np.sign(home_goals - away_goals)

    # Create a logistic regression model
    model = LogisticRegression(penalty="l2", fit_intercept=False, multi_class="ovr", C=1)
    # Fit the logistic regression model to the feature matrix (x) and target variable (y)
    model.fit(x, y)

    # Return the trained logistic regression model and the one-hot encoder
    return model, team_encoding


def train_regression_predictor(results: List[Result]) -> Predictor:
    """
    Trains a logistic regression model using historical match results and returns a LinearRegressionPredictor.

    Args:
        results (List[Result]): A list of historical match results used for training the model.

    Returns:
        Predictor: A LinearRegressionPredictor object with the trained logistic regression model.
    """
    # Build the logistic regression model and team encoder
    model, team_encoding = build_model(results)

    # Create and return a LinearRegressionPredictor with the trained model and team encoder
    return LinearRegressionPredictor(model, team_encoding)
