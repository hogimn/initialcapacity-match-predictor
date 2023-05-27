from typing import List, Tuple, Optional

import numpy as np
from numpy import float64
from numpy.typing import NDArray
from sklearn.preprocessing import OneHotEncoder  # type: ignore
from sklearn.svm import SVC  # type: ignore

from matchpredictor.matchresults.result import Fixture, Outcome, Result, Team
from matchpredictor.predictors.predictor import Predictor, Prediction


class SupportVectorPredictor(Predictor):
    """
    A predictor that uses a Support Vector Machine (SVM) model for prediction based on encoded team names.
    """

    def __init__(self, model: SVC, team_encoding: OneHotEncoder) -> None:
        """
        Initializes the SupportVectorPredictor.

        Args:
            model (SVC): The Support Vector Machine model for prediction.
            team_encoding (OneHotEncoder): The OneHotEncoder used to encode team names.
        """
        self.model = model
        self.team_encoding = team_encoding

    def predict(self, fixture: Fixture) -> Prediction:
        """
        Predicts the outcome of a fixture.

        Args:
            fixture (Fixture): The fixture to predict.

        Returns:
            Prediction: The predicted outcome.
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
        Encodes a team name using the team encoding.

        Args:
            team (Team): The team whose name needs to be encoded.

        Returns:
            Optional[NDArray[float64]]: The encoded team name, or None if encoding fails.
        """
        try:
            # Transform the team name using the encoding
            result: NDArray[float64] = self.team_encoding.transform(np.array(team.name).reshape(-1, 1))
            return result
        except ValueError:
            # Return None if encoding fails
            return None


def build_model(results: List[Result]) -> Tuple[SVC, OneHotEncoder]:
    """
    Build a support vector model and a one-hot encoder based on the provided results.

    Args:
        results (List[Result]): The list of results.

    Returns:
        Tuple[SVC, OneHotEncoder]: The trained support vector model and one-hot encoder.
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

    # Create a support vector model
    model = SVC(kernel='linear', random_state=42)
    # Fit the support vector model to the feature matrix (x) and target variable (y)
    model.fit(x, y)

    # Return the trained support vector model and the one-hot encoder
    return model, team_encoding


def train_random_support_vector_predictor(results: List[Result]) -> Predictor:
    """
    Train a predictor based on the provided results using a support vector model.

    Args:
        results (List[Result]): The list of results.

    Returns:
        Predictor: The trained support vector predictor.
    """
    # Build the support vector model and team encoder
    model, team_encoding = build_model(results)

    # Create and return a SupportVectorPredictor with the trained model and team encoder
    return SupportVectorPredictor(model, team_encoding)
